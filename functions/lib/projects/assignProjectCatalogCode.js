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
exports.assignProjectCatalogCode = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions/v2"));
if (!admin.apps.length) {
    admin.initializeApp();
}
exports.assignProjectCatalogCode = functions.firestore.onDocumentCreated({
    region: 'southamerica-east1',
    document: 'projects/{projectId}',
}, async (event) => {
    const projectDoc = event.data;
    if (!projectDoc)
        return;
    const data = projectDoc.data();
    if (!data || (typeof data.catalogCode === 'string' && data.catalogCode.length > 0)) {
        return;
    }
    try {
        await admin.firestore().runTransaction(async (transaction) => {
            const clientRef = admin.firestore().collection('clients').doc(data.clientId);
            const clientDoc = await transaction.get(clientRef);
            if (!clientDoc.exists) {
                throw new Error('Cliente não encontrado para gerar catalogCode');
            }
            const clientData = clientDoc.data();
            const clientNumber = clientData.clientNumber.padStart(4, '0');
            const baseCodePrefix = `DDM${data.category || 'X'}${clientNumber}`;
            // Buscar projetos existentes para este cliente do mesmo tipo para contar trabalhos
            const projectsQuery = admin
                .firestore()
                .collection('projects')
                .where('clientId', '==', data.clientId)
                .where('category', '==', data.category);
            const projectsSnapshot = await projectsQuery.get();
            const workCount = projectsSnapshot.size;
            const finalCatalogCode = workCount === 0 ? baseCodePrefix : `${baseCodePrefix}.${workCount}`;
            transaction.update(projectDoc.ref, {
                catalogCode: finalCatalogCode,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        });
    }
    catch (error) {
        console.error('Erro ao atribuir código de catálogo:', error);
        throw new functions.https.HttpsError('internal', 'Erro processando código do projeto');
    }
});
