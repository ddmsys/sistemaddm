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
exports.onQuoteSigned = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const admin = __importStar(require("firebase-admin"));
exports.onQuoteSigned = functions.firestore.onDocumentUpdated("quotes/{quoteId}", async (event) => {
    const beforeData = event.data?.before?.data();
    const afterData = event.data?.after?.data();
    if (!afterData || !beforeData)
        return;
    // Verificar se status mudou para 'signed'
    if (beforeData.status !== "signed" && afterData.status === "signed") {
        const db = admin.firestore();
        const quoteId = event.params.quoteId;
        try {
            await db.runTransaction(async (transaction) => {
                let clientId = afterData.clientId;
                // 1. Criar cliente se não existir
                if (!clientId && afterData.client) {
                    const clientRef = db.collection("clients").doc();
                    transaction.set(clientRef, {
                        name: afterData.client.name,
                        email: afterData.client.email,
                        phone: afterData.client.phone,
                        status: "ativo",
                        source: "quote", // Origem: orçamento
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                    clientId = clientRef.id;
                    // Atualizar orçamento com clientId
                    transaction.update(event.data.after.ref, { clientId });
                }
                // 2. Criar projeto
                const projectRef = db.collection("projects").doc();
                transaction.set(projectRef, {
                    clientId,
                    title: afterData.projectTitle || "Projeto sem título",
                    productType: afterData.quoteType === "impressao" ? "L" : "L", // Default para Livro
                    author: afterData.client?.name || "",
                    budget: afterData.totals?.total || 0,
                    status: "open",
                    quoteId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                const projectId = projectRef.id;
                // 3. Criar pedido (order)
                const orderRef = db.collection("orders").doc();
                const paymentSchedule = generatePaymentSchedule(afterData);
                transaction.set(orderRef, {
                    quoteId,
                    clientId,
                    projectId,
                    total: afterData.totals?.total || 0,
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
                        catalogCode: null, // Será preenchido quando projeto receber código
                        value: installment.value,
                        status: "pending",
                        dueDate: installment.dueDate,
                        installmentNumber: index + 1,
                        totalInstallments: paymentSchedule.length,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                });
            });
            console.log(`Orçamento ${quoteId} processado: cliente, projeto e pedido criados`);
        }
        catch (error) {
            console.error("Erro ao processar orçamento assinado:", error);
        }
    }
});
// Função auxiliar para gerar cronograma de pagamento
function generatePaymentSchedule(quoteData) {
    const total = quoteData.totals?.total || 0;
    const paymentPlan = quoteData.paymentPlan;
    if (!paymentPlan || paymentPlan.type === "avista") {
        // À vista - vence em 30 dias
        return [
            {
                value: total,
                dueDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                status: "pending",
            },
        ];
    }
    else if (paymentPlan.type === "parcelado") {
        // Parcelado
        const installmentValue = total / paymentPlan.installments;
        const dueDay = paymentPlan.dueDay || 10;
        const schedule = [];
        for (let i = 0; i < paymentPlan.installments; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i + 1);
            dueDate.setDate(dueDay);
            schedule.push({
                value: installmentValue,
                dueDate: admin.firestore.Timestamp.fromDate(dueDate),
                status: "pending",
            });
        }
        return schedule;
    }
    return [];
}
