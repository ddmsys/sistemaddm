import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

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

    // 🔥 Se já tem número, não faz nada
    if (data?.clientNumber && data.clientNumber !== "") {
      console.log("Cliente já tem número:", data.clientNumber);
      return;
    }

    try {
      const clientNumber = await admin.firestore().runTransaction(async (transaction) => {
        const counterRef = admin.firestore().collection("_counters").doc("clients");
        const counterDoc = await transaction.get(counterRef);

        let nextNumber = 1;
        if (counterDoc.exists) {
          const counterData = counterDoc.data() as { value?: number };
          nextNumber = (counterData?.value ?? 0) + 1;
        }

        const formattedNumber = nextNumber.toString().padStart(4, "0");

        // Atualizar contador
        transaction.set(
          counterRef,
          { value: nextNumber, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true },
        );

        // 🔥 ATUALIZAR O CAMPO clientNumber NO DOCUMENTO DO CLIENTE
        transaction.update(clientDoc.ref, {
          clientNumber: formattedNumber,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return formattedNumber;
      });

      console.log(`✅ Cliente ${event.params.clientId} recebeu número: ${clientNumber}`);
    } catch (error) {
      console.error("❌ Erro ao atribuir número:", error);
    }
  },
);
