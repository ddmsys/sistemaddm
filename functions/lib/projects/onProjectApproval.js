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
exports.onProjectApproval = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions/v2"));
if (!admin.apps.length)
    admin.initializeApp();
exports.onProjectApproval = functions.firestore.onDocumentUpdated({
    region: 'southamerica-east1',
    document: 'projects/{projectId}',
}, async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) {
        console.log('Antes ou depois dos dados não definidos, encerra função.');
        return;
    }
    const afterRef = event.data?.after?.ref;
    if (!afterRef) {
        console.log('Referência after não definida, encerra função.');
        return;
    }
    // Aprovação de múltiplas etapas do cliente: só move o projeto ao status "inprogress" se TODAS aprovadas!
    const beforeApprovals = before.clientApprovalTasks || [];
    const afterApprovals = after.clientApprovalTasks || [];
    const hasNewApproval = afterApprovals.some((task) => task.status === 'approved' &&
        !beforeApprovals.some((oldTask) => oldTask.id === task.id && oldTask.status === 'approved'));
    if (hasNewApproval) {
        const allApproved = afterApprovals.every((task) => task.status === 'approved');
        if (allApproved && after.status !== 'inprogress') {
            await afterRef.update({
                status: 'inprogress',
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`Projeto ${event.params.projectId} movido para produção - todas aprovações concluídas`);
        }
    }
});
