"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onBudgetApproved = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions/v2"));
if (!admin.apps.length)
    admin.initializeApp();
exports.onBudgetApproved = functions.firestore.onDocumentUpdated({
    region: "southamerica-east1",
    document: "budgets/{budgetId}",
}, async (event) => {
    const beforeData = event.data?.before?.data();
    const afterData = event.data?.after?.data();
    if (!afterData || !beforeData)
        return;
    const db = admin.firestore();
    const budgetId = event.params.budgetId;
    try {
        await db.runTransaction(async (transaction) => {
            // 1. Criar cliente se não existir ainda
            let clientId = afterData.clientId;
            if (!clientId && afterData.client) {
                const clientRef = db.collection("clients").doc();
                transaction.set(clientRef, {
                    name: afterData.client.name,
                    email: afterData.client.email || "",
                    phone: afterData.client.phone || "",
                    status: "ativo",
                    source: "budget",
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    clientId: clientRef.id,
                });
                clientId = clientRef.id;
                transaction.update(event.data.after.ref, { clientId });
            }
            // 2. Criar projeto para o orçamento aprovado
            const projectRef = db.collection("projects").doc();
            transaction.set(projectRef, {
                clientId,
                title: afterData.projectData?.title || "Projeto sem título",
                productType: afterData.projectType || "L",
                author: afterData.projectData?.author || afterData.client?.name || "",
                budget: afterData.total || 0,
                status: "open",
                budgetId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            const projectId = projectRef.id;
            // 3. Criar pedido (order) desse projeto e orçamento
            const orderRef = db.collection("orders").doc();
            const paymentSchedule = generatePaymentSchedule(afterData);
            transaction.set(orderRef, {
                budgetId,
                clientId,
                projectId,
                total: afterData.total || 0,
                paymentSchedule,
                status: "aberto",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // 4. Criar faturas baseadas no plano de pagamento
            paymentSchedule.forEach((installment, index) => {
                const invoiceRef = db.collection("invoices").doc();
                transaction.set(invoiceRef, {
                    orderId: orderRef.id,
                    projectId,
                    clientId,
                    catalogCode: null, // será preenchido depois
                    value: installment.value,
                    status: "pending",
                    dueDate: installment.dueDate,
                    installmentNumber: index + 1,
                    totalInstallments: paymentSchedule.length,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            });
        });
        console.log(`Orçamento ${budgetId} processado com criação automática de cliente, projeto, pedido e faturas.`);
    }
    catch (error) {
        console.error("Erro ao processar orçamento aprovado:", error);
    }
});
// Função auxiliar para gerar cronograma de pagamento
function generatePaymentSchedule(budgetData) {
    const total = budgetData.total || 0;
    const paymentMethods = budgetData.paymentMethods;
    // Se não tiver definição de pagamento ou for à vista
    if (!paymentMethods || paymentMethods.includes("avista")) {
        // Vencimento em 30 dias para pagamento à vista
        return [
            {
                value: total,
                dueDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                status: "pending",
            },
        ];
    }
    // Pagamento parcelado (default: 3 parcelas)
    const installments = 3; // Pode ser configurável
    const installmentValue = total / installments;
    const dueDay = 10; // Dia 10 de cada mês
    const schedule = [];
    for (let i = 0; i < installments; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        dueDate.setDate(dueDay);
        schedule.push({
            value: installmentValue,
            dueDate: admin.firestore.Timestamp.fromDate(dueDate),
            status: "pending",
        });
    }
    return schedule;
}
