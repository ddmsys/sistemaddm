import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import * as functions from "firebase-functions/v2";
import PDFDocument from "pdfkit";

if (!admin.apps.length) admin.initializeApp();

export const createQuotePdf = functions.https.onCall(
  { region: "southamerica-east1" },
  async (request) => {
    const quoteId = request.data;
    if (!request.auth)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Usuário não autenticado"
      );

    try {
      const db = admin.firestore();
      const storage = getStorage();
      const quoteDoc = await db.collection("quotes").doc(quoteId).get();
      if (!quoteDoc.exists)
        throw new functions.https.HttpsError(
          "not-found",
          "Orçamento não encontrado"
        );
      const quote = quoteDoc.data()!;

      // Criar PDF com template profissional
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        info: {
          Title: `Orçamento ${quote.number}`,
          Author: "DDM Editora",
          Subject: "Orçamento de Serviços Editoriais",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));

      // Header da empresa
      drawHeader(doc, quote);

      // Dados do cliente
      drawClientInfo(doc, quote, 140);

      // Detalhes do projeto
      drawProjectDetails(doc, quote, 220);

      // Tabela de itens
      drawItemsTable(doc, quote, 300);

      // Totais
      drawTotals(doc, quote, 500);

      // Condições de pagamento
      drawPaymentTerms(doc, quote, 580);

      // Footer
      drawFooter(doc, 700);

      doc.end();

      // Converter para Buffer
      const pdfBuffer = await new Promise<Buffer>((resolve) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
      });

      // Upload para Storage
      const fileName = `quotes/${quoteId}/quote-${quote.number}.pdf`;
      const file = storage.bucket().file(fileName);

      await file.save(pdfBuffer, {
        metadata: { contentType: "application/pdf" },
      });

      // URL assinada (7 dias)
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      // Atualizar orçamento
      await quoteDoc.ref.update({
        pdfUrl: url,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, pdfUrl: url };
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw new functions.https.HttpsError("internal", "Erro interno");
    }
  }
);

// Funções auxiliares para desenhar o PDF
function drawHeader(doc: PDFKit.PDFDocument, quote: any) {
  doc.fontSize(24).fillColor("#2563eb").text("DDM EDITORA", 50, 50);
  doc
    .fontSize(12)
    .fillColor("#000")
    .text("Soluções Editoriais Completas", 50, 80);

  // Linha separadora
  doc.moveTo(50, 100).lineTo(550, 100).stroke();

  // Dados do orçamento
  doc.fontSize(16).text("ORÇAMENTO", 400, 50);
  doc
    .fontSize(10)
    .text(`Número: ${quote.number}`, 400, 70)
    .text(
      `Data: ${quote.issueDate?.toDate().toLocaleDateString("pt-BR")}`,
      400,
      85
    );
}

function drawClientInfo(doc: PDFKit.PDFDocument, quote: any, y: number) {
  doc.fontSize(14).text("DADOS DO CLIENTE", 50, y);

  const client = quote.client || {};
  doc
    .fontSize(10)
    .text(`Nome: ${client.name || "N/A"}`, 50, y + 25)
    .text(`Email: ${client.email || "N/A"}`, 50, y + 40)
    .text(`Telefone: ${client.phone || "N/A"}`, 300, y + 40);
}

function drawProjectDetails(doc: PDFKit.PDFDocument, quote: any, y: number) {
  doc.fontSize(14).text("DETALHES DO PROJETO", 50, y);

  doc
    .fontSize(10)
    .text(`Título: ${quote.projectTitle || "Não informado"}`, 50, y + 25)
    .text(
      `Tipo: ${
        quote.quoteType === "producao"
          ? "Produção"
          : quote.quoteType === "impressao"
          ? "Impressão"
          : "Misto"
      }`,
      50,
      y + 40
    )
    .text(`Prazo: ${quote.productionTime || "A definir"}`, 300, y + 40);
}

function drawItemsTable(doc: PDFKit.PDFDocument, quote: any, y: number) {
  doc.fontSize(14).text("ITENS E SERVIÇOS", 50, y);

  const items = quote.items || [];
  const tableTop = y + 30;

  // Cabeçalho da tabela
  doc
    .fontSize(9)
    .fillColor("#666")
    .text("Descrição", 50, tableTop)
    .text("Qtd", 350, tableTop)
    .text("Valor Unit.", 400, tableTop)
    .text("Total", 480, tableTop);

  // Linha do cabeçalho
  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // Itens
  let itemY = tableTop + 25;
  doc.fillColor("#000");

  items.forEach((item: any, index: number) => {
    doc
      .fontSize(9)
      .text(item.description || "", 50, itemY, { width: 290 })
      .text(item.qty?.toString() || "1", 350, itemY)
      .text(item.unitPrice ? `R$ ${item.unitPrice.toFixed(2)}` : "", 400, itemY)
      .text(`R$ ${(item.total || 0).toFixed(2)}`, 480, itemY);

    itemY += 20;
  });
}

function drawTotals(doc: PDFKit.PDFDocument, quote: any, y: number) {
  const totals = quote.totals || {};

  doc
    .fontSize(12)
    .text(`Subtotal: R$ ${(totals.subtotal || 0).toFixed(2)}`, 400, y)
    .text(`Desconto: R$ ${(totals.discount || 0).toFixed(2)}`, 400, y + 20)
    .text(`Frete: R$ ${(totals.freight || 0).toFixed(2)}`, 400, y + 40);

  // Total destacado
  doc
    .fontSize(14)
    .fillColor("#2563eb")
    .text(`TOTAL: R$ ${(totals.total || 0).toFixed(2)}`, 400, y + 65)
    .fillColor("#000");
}

function drawPaymentTerms(doc: PDFKit.PDFDocument, quote: any, y: number) {
  doc.fontSize(12).text("CONDIÇÕES DE PAGAMENTO", 50, y);

  const paymentPlan = quote.paymentPlan || {};
  let paymentText = "";

  if (paymentPlan.type === "avista") {
    paymentText = "Pagamento à vista - Vencimento: 30 dias após assinatura";
  } else if (paymentPlan.type === "parcelado") {
    paymentText = `Parcelado em ${
      paymentPlan.installments
    }x - Vencimento todo dia ${paymentPlan.dueDay || 10}`;
  }

  doc.fontSize(10).text(paymentText, 50, y + 20);

  if (quote.terms) {
    doc.text("Observações:", 50, y + 40);
    doc.text(quote.terms, 50, y + 55, { width: 500 });
  }
}

function drawFooter(doc: PDFKit.PDFDocument, y: number) {
  doc
    .fontSize(8)
    .fillColor("#666")
    .text("DDM Editora - contato@ddmeditora.com - (11) 99999-9999", 50, y)
    .text("Este orçamento é válido por 30 dias.", 50, y + 15);
}
