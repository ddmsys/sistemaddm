import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

export const onProjectApproval = functions.firestore.onDocumentUpdated(
  "projects/{projectId}",
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();

    if (!before || !after) {
      console.log("Antes ou depois dos dados não definidos, encerra função");
      return;
    }

    const afterRef = event.data?.after?.ref;
    if (!afterRef) {
      console.log("Referência after não definida, encerra função");
      return;
    }

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
