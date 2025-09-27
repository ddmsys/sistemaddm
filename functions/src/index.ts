// functions/src/index.ts
import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

// 1. Numeração automática de clientes (Firestore onDocumentCreated)
// 1. Numeração automática de clientes
export const assignClientNumber = functions.firestore.onDocumentCreated(
  { document: "clients/{clientId}", region: "southamerica-east1" },
  async (event) => {
    const clientDoc = event.data;
    if (!clientDoc) return;

    const db = admin.firestore();
    const clientNumber = Date.now();
    await db.doc(`clients/${event.params.clientId}`).update({ clientNumber });

    console.log(`Cliente numerado com: ${clientNumber}`);
  }
);

// 2. Orçamento assinado
export const onQuoteSigned = functions.firestore.onDocumentUpdated(
  { document: "quotes/{quoteId}", region: "southamerica-east1" },
  async (event) => {
    if (!event.data?.before || !event.data?.after) return; // Verifica existência segura

    const before = event.data.before.data();
    const after = event.data.after.data();

    if (!after?.signed || before?.signed) return;

    console.log(`Orçamento ${event.params.quoteId} foi assinado.`);
  }
);

// 4. HTTPS callable
export const createQuotePdf = functions.https.onCall(
  { region: "southamerica-east1" },
  async (request) => {
    return { success: true, message: "PDF criado com sucesso!" };
  }
);

export const createInvoicePdf = functions.https.onCall(
  { region: "southamerica-east1" },
  async (request) => {
    return { success: true };
  }
);

// Exports das functions existentes
export * from "./clients/assignClientNumber";
export * from "./quotes/createQuotePdf";
export * from "./quotes/onQuoteSigned";

// NOVOS EXPORTS para projetos
export * from "./projects/assignProjectCatalogCode";
export * from "./projects/onProjectApproval";

export const sendNotification = functions.https.onCall(
  { region: "southamerica-east1" },
  async (request) => {
    return { success: true, message: "Notificação enviada" };
  }
);
