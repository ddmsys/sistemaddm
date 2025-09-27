import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}
export const assignClientNumber = functions.firestore.onDocumentCreated(
  {
    document: "clients/{clientId}",
    region: "southamerica-east1", // Região correta para São Paulo!
    // Se quiser node 20: nodeVersion: "20"
  },
  async (event) => {
    const clientDoc = event.data;
    if (!clientDoc) return;

    const db = admin.firestore();

    const data = clientDoc.data();
    if (data.clientNumber) return;

    try {
      await db.runTransaction(async (transaction) => {
        const counterRef = db.collection("counters").doc("clients");
        const counterDoc = await transaction.get(counterRef);

        let nextNumber = 1;
        if (counterDoc.exists) {
          nextNumber = (counterDoc.data()?.lastNumber ?? 0) + 1;
        }

        transaction.set(
          counterRef,
          { lastNumber: nextNumber },
          { merge: true }
        );
        transaction.update(clientDoc.ref, {
          clientNumber: nextNumber,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Cliente ${clientDoc.id} recebeu número ${nextNumber}`);
      });
    } catch (error) {
      console.error("Erro ao atribuir número do cliente:", error);
    }
  }
);
