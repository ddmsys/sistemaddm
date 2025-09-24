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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.createInvoicePdf = exports.createQuotePdf = exports.onQuoteSigned = exports.assignClientNumber = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
// 1. Numeração automática de clientes (Firestore onDocumentCreated)
// 1. Numeração automática de clientes
exports.assignClientNumber = functions.firestore.onDocumentCreated({ document: "clients/{clientId}", region: "southamerica-east1" }, async (event) => {
    const clientDoc = event.data;
    if (!clientDoc)
        return;
    const db = admin.firestore();
    const clientNumber = Date.now();
    await db.doc(`clients/${event.params.clientId}`).update({ clientNumber });
    console.log(`Cliente numerado com: ${clientNumber}`);
});
// 2. Orçamento assinado
exports.onQuoteSigned = functions.firestore.onDocumentUpdated({ document: "quotes/{quoteId}", region: "southamerica-east1" }, async (event) => {
    if (!event.data?.before || !event.data?.after)
        return; // Verifica existência segura
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (!after?.signed || before?.signed)
        return;
    console.log(`Orçamento ${event.params.quoteId} foi assinado.`);
});
// 4. HTTPS callable
exports.createQuotePdf = functions.https.onCall({ region: "southamerica-east1" }, async (request) => {
    return { success: true, message: "PDF criado com sucesso!" };
});
exports.createInvoicePdf = functions.https.onCall({ region: "southamerica-east1" }, async (request) => {
    return { success: true };
});
// Exports das functions existentes
__exportStar(require("./clients/assignClientNumber"), exports);
__exportStar(require("./quotes/createQuotePdf"), exports);
__exportStar(require("./quotes/onQuoteSigned"), exports);
// NOVOS EXPORTS para projetos
__exportStar(require("./projects/assignProjectCatalogCode"), exports);
__exportStar(require("./projects/onProjectApproval"), exports);
exports.sendNotification = functions.https.onCall({ region: "southamerica-east1" }, async (request) => {
    return { success: true, message: "Notificação enviada" };
});
