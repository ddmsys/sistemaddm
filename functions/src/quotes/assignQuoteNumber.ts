import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

if (!admin.apps.length) admin.initializeApp();

function formatNumberDate() {
  const now = new Date();
  const yearPrefix = "5"; // versão 5 fixa no prefixo

  const MM = (now.getMonth() + 1).toString().padStart(2, "0");
  const DD = now.getDate().toString().padStart(2, "0");
  const HH = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");

  return `${yearPrefix}${MM}${DD}.${HH}${mm}`;
}

export const assignQuoteNumber = functions.firestore.onDocumentCreated(
  {
    region: "southamerica-east1",
    document: "quotes/{quoteId}",
  },
  async (event) => {
    const quoteDoc = event.data;
    if (!quoteDoc) return;
    const data = quoteDoc.data() as { number?: string };

    // Não sobrescreve se já existir número
    if (data.number && data.number.length > 0) return;

    try {
      // Gera o número com timestamp customizado v5.MMDD.HHMM
      const quoteNumber = formatNumberDate();

      await quoteDoc.ref.update({
        number: quoteNumber,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(
        `Orçamento ${event.params.quoteId} recebeu número: ${quoteNumber}`
      );
    } catch (error) {
      console.error("Erro ao atribuir número de orçamento:", error);
    }
  }
);
