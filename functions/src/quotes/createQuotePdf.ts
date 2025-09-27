import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import PDFDocument from "pdfkit";
import { getStorage } from "firebase-admin/storage";

if (!admin.apps.length) {
  admin.initializeApp();
}
export const createQuotePdf = functions.https.onCall(async (request) => {
  try {
    const { quoteId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Usuário não autenticado"
      );
    }

    const db = admin.firestore();
    const storage = getStorage();

    // Buscar orçamento
    const quoteDoc = await db.collection("quotes").doc(quoteId).get();
    if (!quoteDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Orçamento não encontrado"
      );
    }

    const quote = quoteDoc.data()!;

    // Criar PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    // Cabeçalho
    doc.fontSize(20).text("DDM EDITORA", 50, 50);
    doc.fontSize(14).text("Orçamento", 50, 80);
    doc.text(`Número: ${quote.number}`, 400, 80);

    // Dados do cliente
    if (quote.client) {
      doc.text(`Cliente: ${quote.client.name}`, 50, 120);
      if (quote.client.email) {
        doc.text(`Email: ${quote.client.email}`, 50, 140);
      }
    }

    // Título do projeto
    if (quote.projectTitle) {
      doc.text(`Projeto: ${quote.projectTitle}`, 50, 170);
    }

    // Data de emissão
    if (quote.issueDate) {
      const date = quote.issueDate.toDate();
      doc.text(`Data: ${date.toLocaleDateString("pt-BR")}`, 50, 200);
    }

    // Itens
    let yPosition = 240;
    if (quote.items && quote.items.length > 0) {
      doc.text("Itens:", 50, yPosition);

      yPosition += 30;
      quote.items.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item.description}`, 50, yPosition);
        doc.text(`R$ ${item.total?.toFixed(2) || "0,00"}`, 400, yPosition);
        yPosition += 30;
      });
    }

    // Total
    if (quote.totals?.total) {
      yPosition += 30;
      doc
        .fontSize(16)
        .text(
          `Total Geral: R$ ${quote.totals.total.toFixed(2)}`,
          50,
          yPosition
        );
    }

    doc.end();

    // Aguardar conclusão do PDF
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });

    // Upload para Storage
    const fileName = `quotes/${quoteId}/quote-${quote.number}.pdf`;
    const file = storage.bucket().file(fileName);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: "application/pdf",
      },
    });

    // Gerar URL assinada (válida por 7 dias)
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    // Atualizar documento com URL do PDF
    await quoteDoc.ref.update({
      pdfUrl: url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, pdfUrl: url };
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new functions.https.HttpsError("internal", "Erro ao gerar PDF");
  }
});
