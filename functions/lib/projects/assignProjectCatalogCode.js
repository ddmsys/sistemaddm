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
// functions/src/projects/assignProjectCatalogCode.ts (NOVO ARQUIVO)
const functions = __importStar(require("firebase-functions/v2"));
const admin = __importStar(require("firebase-admin"));
exports.assignProjectCatalogCode = functions.firestore.onDocumentCreated("projects/{projectId}", async (event) => {
    const projectDoc = event.data;
    if (!projectDoc || projectDoc.data().catalogCode)
        return;
    const db = admin.firestore();
    const projectData = projectDoc.data();
    try {
        // Buscar cliente para pegar o clientNumber
        const clientDoc = await db.doc(`clients/${projectData.clientId}`).get();
        if (!clientDoc.exists) {
            console.error("Cliente não encontrado:", projectData.clientId);
            return;
        }
        const clientData = clientDoc.data();
        const clientNumber = clientData.clientNumber;
        // Contar projetos existentes do cliente para gerar número sequencial
        const clientProjectsQuery = await db
            .collection("projects")
            .where("clientId", "==", projectData.clientId)
            .get();
        const projectNumber = clientProjectsQuery.size;
        // Gerar catalogCode: DDM + productType + clientNumber + projectNumber
        const productCode = projectData.productType === "livro"
            ? "L"
            : projectData.productType === "curso"
                ? "C"
                : "X";
        const catalogCode = `DDM${productCode}${clientNumber
            .toString()
            .padStart(3, "0")}.${projectNumber}`;
        // Atualizar o documento do projeto
        await projectDoc.ref.update({
            catalogCode,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`CatalogCode gerado: ${catalogCode} para projeto ${event.params.projectId}`);
    }
    catch (error) {
        console.error("Erro ao gerar catalogCode:", error);
    }
});
