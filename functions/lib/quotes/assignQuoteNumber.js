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
exports.assignQuoteNumber = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions/v2"));
if (!admin.apps.length)
    admin.initializeApp();
function formatNumberDate() {
    const now = new Date();
    const yearPrefix = "5"; // versão 5 fixa no prefixo
    const MM = (now.getMonth() + 1).toString().padStart(2, "0");
    const DD = now.getDate().toString().padStart(2, "0");
    const HH = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    return `${yearPrefix}${MM}${DD}.${HH}${mm}`;
}
exports.assignQuoteNumber = functions.firestore.onDocumentCreated({
    region: "southamerica-east1",
    document: "quotes/{quoteId}",
}, async (event) => {
    const quoteDoc = event.data;
    if (!quoteDoc)
        return;
    const data = quoteDoc.data();
    // Não sobrescreve se já existir número
    if (data.number && data.number.length > 0)
        return;
    try {
        // Gera o número com timestamp customizado v5.MMDD.HHMM
        const quoteNumber = formatNumberDate();
        await quoteDoc.ref.update({
            number: quoteNumber,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Orçamento ${event.params.quoteId} recebeu número: ${quoteNumber}`);
    }
    catch (error) {
        console.error("Erro ao atribuir número de orçamento:", error);
    }
});
