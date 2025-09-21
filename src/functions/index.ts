import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Função para criar projeto automaticamente ao aprovar orçamento
export const onQuoteApproved = functions.firestore
  .document("quotes/{quoteId}")
  .onUpdate(async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Detecta mudança do status para "signed" (aprovado)
    if (before.status !== "signed" && after.status === "signed") {
      const quoteId = event.data?.after.id ?? "";

      const projectData: any = {
        clientId: after.clientId,
        clientNumber: after.clientNumber,
        projectType: after.quoteType === "producao" ? "L" : "X",
        name: after.projectTitle,
        description: after.terms,
        status: "planejamento",
        book: after.material,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        originQuoteId: quoteId,
      };

      const projectRef = await db.collection("projects").add(projectData);
      await db
        .collection("quotes")
        .doc(quoteId)
        .update({ projectId: projectRef.id });
    }
  });

// Função para criar/atualizar cliente quando lead vira cliente
export const onLeadConverted = functions.firestore
  .document("leads/{leadId}")
  .onUpdate(async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Detecta mudança do status para "converted"
    if (before.status !== "converted" && after.status === "converted") {
      const leadId = event.data?.after.id ?? "";

      const clientData = {
        name: after.name,
        email: after.email,
        phone: after.phone,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        originLeadId: leadId,
      };

      await db.collection("clients").doc(leadId).set(clientData);
    }
  });
