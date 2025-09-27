// functions/src/projects/assignProjectCatalogCode.ts (NOVO ARQUIVO)
import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

export const assignProjectCatalogCode = functions.firestore.onDocumentCreated(
  "projects/{projectId}",
  async (event) => {
    const projectDoc = event.data;
    if (!projectDoc || projectDoc.data().catalogCode) return;

    const db = admin.firestore();
    const projectData = projectDoc.data();

    try {
      // Buscar cliente para pegar o clientNumber
      const clientDoc = await db.doc(`clients/${projectData.clientId}`).get();
      if (!clientDoc.exists) {
        console.error("Cliente não encontrado:", projectData.clientId);
        return;
      }

      const clientData = clientDoc.data()!;
      const clientNumber = clientData.clientNumber;

      // Contar projetos existentes do cliente para gerar número sequencial
      const clientProjectsQuery = await db
        .collection("projects")
        .where("clientId", "==", projectData.clientId)
        .get();

      const projectNumber = clientProjectsQuery.size;

      // Gerar catalogCode: DDM + productType + clientNumber + projectNumber
      const productCode =
        projectData.productType === "livro"
          ? "L"
          : projectData.productType === "curso"
          ? "C"
          : "X";

      const catalogCode = `DDM${productCode}${clientNumber
        .toString()
        .padStart(3, "0")}.${projectNumber}`;

      // Atualizar o documento do projeto
      await projectDoc.ref.update({
        catalogCode,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(
        `CatalogCode gerado: ${catalogCode} para projeto ${event.params.projectId}`
      );
    } catch (error) {
      console.error("Erro ao gerar catalogCode:", error);
    }
  }
);
