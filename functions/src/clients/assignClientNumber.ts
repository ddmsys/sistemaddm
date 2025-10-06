import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

// Inicializa o Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export const assignClientNumber = functions.firestore.onDocumentCreated(
  {
    region: "southamerica-east1",
    document: "clients/{clientId}",
  },
  async (event) => {
    const clientDoc = event.data;
    if (!clientDoc) return;

    const data = clientDoc.data() as { clientNumber?: string };
    if (
      !data ||
      (typeof data.clientNumber === "string" && data.clientNumber.length > 0)
    )
      return;

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const counterRef = admin
          .firestore()
          .collection("_counters")
          .doc("clients");
        const counterDoc = await transaction.get(counterRef);

        let nextNumber = 1;
        if (counterDoc.exists) {
          const counterData = counterDoc.data() as { value?: number };
          nextNumber = (counterData?.value ?? 0) + 1;
        }

        const formattedNumber = nextNumber.toString().padStart(4, "0");

        transaction.set(
          counterRef,
          {
            value: nextNumber,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        transaction.update(clientDoc.ref, {
          clientNumber: formattedNumber,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
    } catch (error) {
      console.error("Erro ao atribuir número sequencial:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Erro processando numeração do cliente"
      );
    }
  }
);
