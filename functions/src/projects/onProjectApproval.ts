import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

if (!admin.apps.length) admin.initializeApp();

export const onProjectApproval = functions.firestore.onDocumentUpdated(
  {
    region: "southamerica-east1",
    document: "projects/{projectId}",
  },
  async (event) => {
    const before = event.data?.before?.data() as any;
    const after = event.data?.after?.data() as any;
    if (!before || !after) {
      console.log("Antes ou depois dos dados não definidos, encerra função.");
      return;
    }
    const afterRef = event.data?.after?.ref;
    if (!afterRef) {
      console.log("Referência after não definida, encerra função.");
      return;
    }

    // Aprovação de múltiplas etapas do cliente: só move o projeto ao status "inprogress" se TODAS aprovadas!
    const beforeApprovals = before.clientApprovalTasks || [];
    const afterApprovals = after.clientApprovalTasks || [];
    const hasNewApproval = afterApprovals.some(
      (task: any) =>
        task.status === "approved" &&
        !beforeApprovals.some(
          (oldTask: any) =>
            oldTask.id === task.id && oldTask.status === "approved"
        )
    );
    if (hasNewApproval) {
      const allApproved = afterApprovals.every(
        (task: any) => task.status === "approved"
      );
      if (allApproved && after.status !== "inprogress") {
        await afterRef.update({
          status: "inprogress",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(
          `Projeto ${event.params.projectId} movido para produção - todas aprovações concluídas`
        );
      }
    }
  }
);
