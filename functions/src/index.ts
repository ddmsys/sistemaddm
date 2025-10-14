import * as admin from 'firebase-admin';

// Inicializa o SDK apenas uma vez
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exporte SOMENTE as funções corretas
export * from './budgets/assignBudgetNumber';
export * from './budgets/createBudgetPdf';
export * from './budgets/onBudgetApproved';
export * from './clients/assignClientNumber';
export * from './projects/assignProjectCatalogCode';
export * from './projects/onProjectApproval';
