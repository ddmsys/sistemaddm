import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import * as functions from 'firebase-functions/v2';
import PDFDocument from 'pdfkit';

if (!admin.apps.length) admin.initializeApp();

export const createBudgetPdf = functions.https.onCall(
  { region: 'southamerica-east1' },
  async (request) => {
    const budgetId = request.data;
    if (!request.auth)
      throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');

    try {
      const db = admin.firestore();
      const storage = getStorage();
      const budgetDoc = await db.collection('budgets').doc(budgetId).get();
      if (!budgetDoc.exists)
        throw new functions.https.HttpsError('not-found', 'Orçamento não encontrado');
      const budget = budgetDoc.data()!;

      // Criar PDF
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));

      // Cabeçalho
      doc.fontSize(20).text('DDM EDITORA', 50, 50);
      doc.fontSize(14).text('Orçamento', 50, 80);
      doc.text(`Número: ${budget.number}`, 400, 80);

      // Dados do cliente
      if (budget.client) {
        doc.text(`Cliente: ${budget.client.name}`, 50, 120);
        if (budget.client.email) {
          doc.text(`Email: ${budget.client.email}`, 50, 140);
        }
      }

      // Título do projeto
      if (budget.projectData?.title) {
        doc.text(`Projeto: ${budget.projectData.title}`, 50, 170);
      }

      // Data de emissão
      if (budget.issueDate) {
        const date = budget.issueDate.toDate();
        doc.text(`Data: ${date.toLocaleDateString('pt-BR')}`, 50, 200);
      }

      // Itens
      let yPosition = 240;
      if (budget.items && budget.items.length > 0) {
        doc.text('Itens:', 50, yPosition);

        yPosition += 30;
        budget.items.forEach((item: any, index: number) => {
          doc.text(`${index + 1}. ${item.description}`, 50, yPosition);
          doc.text(`R$ ${item.totalPrice?.toFixed(2) || '0,00'}`, 400, yPosition);
          yPosition += 30;
        });
      }

      // Total
      if (budget.total) {
        yPosition += 30;
        doc.fontSize(16).text(`Total Geral: R$ ${budget.total.toFixed(2)}`, 50, yPosition);
      }

      doc.end();

      // Aguardar conclusão do PDF
      const pdfBuffer = await new Promise<Buffer>((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      });

      // Upload para o Storage
      const fileName = `budgets/${budgetId}/budget-${budget.number}.pdf`;
      const file = storage.bucket().file(fileName);
      await file.save(pdfBuffer, {
        metadata: { contentType: 'application/pdf' },
      });

      // URL com expiração de 7 dias
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      // Atualizar orçamento
      await budgetDoc.ref.update({
        pdfUrl: url,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, pdfUrl: url };
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new functions.https.HttpsError('internal', 'Erro interno');
    }
  },
);
