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
exports.assignClientNumber = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
exports.assignClientNumber = functions.firestore.onDocumentCreated({
    document: "clients/{clientId}",
    region: "southamerica-east1", // Região correta para São Paulo!
    // Se quiser node 20: nodeVersion: "20"
}, async (event) => {
    const clientDoc = event.data;
    if (!clientDoc)
        return;
    const db = admin.firestore();
    const data = clientDoc.data();
    if (data.clientNumber)
        return;
    try {
        await db.runTransaction(async (transaction) => {
            const counterRef = db.collection("counters").doc("clients");
            const counterDoc = await transaction.get(counterRef);
            let nextNumber = 1;
            if (counterDoc.exists) {
                nextNumber = (counterDoc.data()?.lastNumber ?? 0) + 1;
            }
            transaction.set(counterRef, { lastNumber: nextNumber }, { merge: true });
            transaction.update(clientDoc.ref, {
                clientNumber: nextNumber,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`Cliente ${clientDoc.id} recebeu número ${nextNumber}`);
        });
    }
    catch (error) {
        console.error("Erro ao atribuir número do cliente:", error);
    }
});
