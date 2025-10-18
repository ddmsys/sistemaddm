import * as admin from "firebase-admin";

// Inicializa o SDK apenas uma vez
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exporte SOMENTE as funções corretas

// ❌ COMENTADO: Arquivos ainda não criados
// export { approveBudget } from "./budgets/approveBudget";
// export { createBudgetPdf } from "./budgets/createBudgetPdf";
// export { sendBudgetEmail } from "./budgets/sendBudgetEmail";
// export * from "./projects/onProjectApproval";

// ✅ MANTIDO: Arquivos que existem
export * from "./budgets/assignBudgetNumber";
export * from "./clients/assignClientNumber";
export * from "./projects/assignProjectCatalogCode";
