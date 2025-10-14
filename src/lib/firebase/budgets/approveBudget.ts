// src/lib/firebase/budgets/approveBudget.ts

/**
 * FUNÇÃO CRÍTICA: Aprovação de Orçamento
 *
 * Quando um orçamento é aprovado, esta função:
 * 1. Converte Lead → Client (se for lead novo)
 * 2. Cria Book (livro no catálogo DDM)
 * 3. Cria Order (pedido)
 * 4. Cria ProductionProject (projeto de produção)
 * 5. Atualiza Budget com IDs criados
 */

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { generateCatalogCode } from '@/lib/types/books';
import { Budget } from '@/lib/types/budgets';
import { Lead } from '@/lib/types/leads';
import { createOrderFromBudget, generateOrderNumber } from '@/lib/types/orders';
import {
  generateProjectNumber,
  ProductionProjectStatus,
  ProjectStageType,
  StageStatus,
} from '@/lib/types/production-projects';

// ==================== INTERFACES ====================

export interface ApproveBudgetResult {
  clientId: string;
  bookId: string;
  orderId: string;
  productionProjectId: string;
  catalogCode: string;
}

export interface ApproveBudgetError {
  step: 'validation' | 'client' | 'book' | 'order' | 'project' | 'budget_update';
  message: string;
  originalError?: any;
}

// ==================== MAIN FUNCTION ====================

export async function approveBudget(
  budgetId: string,
  userId: string,
): Promise<ApproveBudgetResult> {
  try {
    // ===== STEP 1: LOAD & VALIDATE BUDGET =====
    const budgetDoc = await getDoc(doc(db, 'budgets', budgetId));
    if (!budgetDoc.exists()) {
      throw createError('validation', 'Budget not found');
    }

    const budget = { id: budgetDoc.id, ...budgetDoc.data() } as Budget;

    // Validações
    if (budget.status !== 'sent') {
      throw createError('validation', 'Budget must be in sent status to be approved');
    }

    if (!budget.leadId && !budget.clientId) {
      throw createError('validation', 'Budget must have leadId or clientId');
    }

    if (!budget.projectData?.title) {
      throw createError('validation', 'Budget must have project data with title');
    }

    // ===== STEP 2: GET OR CREATE CLIENT =====
    let clientId: string;
    let clientNumber: number;
    let clientName: string;

    if (budget.clientId) {
      // Cliente já existe (reimpressão)
      clientId = budget.clientId;
      const clientDoc = await getDoc(doc(db, 'clients', clientId));
      if (!clientDoc.exists()) {
        throw createError('client', 'Client not found');
      }
      const clientData = clientDoc.data();
      clientNumber = clientData.catalogNumber;
      clientName = clientData.name;
    } else if (budget.leadId) {
      // Criar cliente a partir do lead
      const result = await createClientFromLead(budget.leadId, userId);
      clientId = result.clientId;
      clientNumber = result.clientNumber;
      clientName = result.clientName;
    } else {
      throw createError('validation', 'No leadId or clientId found');
    }

    // ===== STEP 3: CREATE BOOK =====
    const bookResult = await createBookFromBudget(
      budget,
      clientId,
      clientNumber,
      clientName,
      userId,
    );

    // ===== STEP 4: CREATE ORDER =====
    const orderId = await createOrderFromBudgetData(
      budget,
      clientId,
      clientName,
      bookResult.bookId,
      bookResult.bookTitle,
      userId,
    );

    // ===== STEP 5: CREATE PRODUCTION PROJECT =====
    const productionProjectId = await createProductionProjectFromOrder(
      orderId,
      clientId,
      clientName,
      bookResult.bookId,
      bookResult.bookTitle,
      budget,
      userId,
    );

    // ===== STEP 6: UPDATE BUDGET =====
    await updateDoc(doc(db, 'budgets', budgetId), {
      status: 'approved',
      approvalDate: Timestamp.now(),
      clientId: clientId,
      bookId: bookResult.bookId,
      updatedAt: Timestamp.now(),
    });

    // ===== SUCCESS! =====
    return {
      clientId,
      bookId: bookResult.bookId,
      orderId,
      productionProjectId,
      catalogCode: bookResult.catalogCode,
    };
  } catch (error: any) {
    console.error('Error approving budget:', error);
    throw error;
  }
}

// ==================== HELPER FUNCTIONS ====================

function createError(step: ApproveBudgetError['step'], message: string, error?: any) {
  return {
    step,
    message,
    originalError: error,
  };
}

// ===== CREATE CLIENT FROM LEAD =====
async function createClientFromLead(
  leadId: string,
  userId: string,
): Promise<{ clientId: string; clientNumber: number; clientName: string }> {
  try {
    const leadDoc = await getDoc(doc(db, 'leads', leadId));
    if (!leadDoc.exists()) {
      throw createError('client', 'Lead not found');
    }

    const lead = leadDoc.data() as Lead;

    // Gerar número do catálogo (próximo disponível)
    const clientNumber = await getNextClientNumber();

    // Criar cliente
    const clientData = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      catalogNumber: clientNumber,
      origin: 'lead_conversion',
      leadId: leadId,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    };

    const clientRef = await addDoc(collection(db, 'clients'), clientData);

    // Atualizar lead para status convertido
    await updateDoc(doc(db, 'leads', leadId), {
      status: 'convertido',
      clientId: clientRef.id,
      updatedAt: Timestamp.now(),
    });

    return {
      clientId: clientRef.id,
      clientNumber: clientNumber,
      clientName: lead.name,
    };
  } catch (error) {
    throw createError('client', 'Failed to create client from lead', error);
  }
}

// ===== GET NEXT CLIENT NUMBER =====
async function getNextClientNumber(): Promise<number> {
  try {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, orderBy('catalogNumber', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 1;
    }

    const lastClient = snapshot.docs[0].data();
    return (lastClient.catalogNumber || 0) + 1;
  } catch (error) {
    console.error('Error getting next client number:', error);
    return 1;
  }
}

// ===== CREATE BOOK FROM BUDGET =====
async function createBookFromBudget(
  budget: Budget,
  clientId: string,
  clientNumber: number,
  clientName: string,
  userId: string,
): Promise<{ bookId: string; catalogCode: string; bookTitle: string }> {
  try {
    if (!budget.projectType) {
      throw createError('book', 'Budget must have projectType');
    }

    if (!budget.projectData?.title) {
      throw createError('book', 'Budget must have project title');
    }

    // Obter próximo workNumber para este cliente/tipo
    const workNumber = await getNextWorkNumber(clientId, budget.projectType);

    // Gerar código de catálogo
    const catalogCode = generateCatalogCode(budget.projectType, clientNumber, workNumber);

    // Criar livro
    const bookData = {
      clientId: clientId,
      catalogCode: catalogCode,
      catalogMetadata: {
        prefix: 'DDM' as const,
        type: budget.projectType,
        clientNumber: clientNumber,
        workNumber: workNumber,
      },
      title: budget.projectData.title,
      subtitle: budget.projectData.subtitle,
      author: budget.projectData.author || clientName,
      specifications: budget.projectData.specifications,
      notes: budget.notes,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    };

    const bookRef = await addDoc(collection(db, 'books'), bookData);

    return {
      bookId: bookRef.id,
      catalogCode: catalogCode,
      bookTitle: budget.projectData.title,
    };
  } catch (error) {
    throw createError('book', 'Failed to create book', error);
  }
}

// ===== GET NEXT WORK NUMBER =====
async function getNextWorkNumber(clientId: string, projectType: string): Promise<number> {
  try {
    const booksRef = collection(db, 'books');
    const q = query(
      booksRef,
      where('clientId', '==', clientId),
      where('catalogMetadata.type', '==', projectType),
      orderBy('catalogMetadata.workNumber', 'desc'),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 1;
    }

    const lastBook = snapshot.docs[0].data();
    return (lastBook.catalogMetadata?.workNumber || 0) + 1;
  } catch (error) {
    console.error('Error getting next work number:', error);
    return 1;
  }
}

// ===== CREATE ORDER FROM BUDGET =====
async function createOrderFromBudgetData(
  budget: Budget,
  clientId: string,
  clientName: string,
  bookId: string,
  bookTitle: string,
  userId: string,
): Promise<string> {
  try {
    // Criar Order usando helper do tipo
    const orderData = createOrderFromBudget(budget, clientName, bookTitle);
    const orderNumber = generateOrderNumber();

    const completeOrderData = {
      ...orderData,
      number: orderNumber,
      clientId: clientId,
      bookId: bookId,
      budgetId: budget.id!,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    };

    const orderRef = await addDoc(collection(db, 'orders'), completeOrderData);
    return orderRef.id;
  } catch (error) {
    throw createError('order', 'Failed to create order', error);
  }
}

// ===== CREATE PRODUCTION PROJECT FROM ORDER =====
async function createProductionProjectFromOrder(
  orderId: string,
  clientId: string,
  clientName: string,
  bookId: string,
  bookTitle: string,
  budget: Budget,
  userId: string,
): Promise<string> {
  try {
    const projectNumber = await getNextProjectNumber();

    // Criar stages baseadas nos itens do orçamento
    const stages = budget.items
      .map((item, index) => {
        let stageType = ProjectStageType.OTHER;
        let stageName = item.description;

        // Mapear tipo de item para tipo de stage
        if (item.type === 'editorial_service') {
          if ('service' in item) {
            // Mapear serviços específicos
            const service = item.service.toString();
            if (service.includes('Revisão')) stageType = ProjectStageType.REVISION;
            else if (service.includes('Diagramação')) stageType = ProjectStageType.LAYOUT;
            else if (service.includes('Capa')) stageType = ProjectStageType.COVER_CREATION;
            else if (service.includes('ISBN')) stageType = ProjectStageType.ISBN_CREATION;
            else stageType = ProjectStageType.TEXT_PREPARATION;

            stageName = item.service.toString();
          }
        } else if (item.type === 'printing') {
          stageType = ProjectStageType.PRINTING;
          stageName = 'Impressão';
        }

        return {
          id: `stage_${Date.now()}_${index}`,
          type: stageType,
          name: stageName,
          description: item.notes,
          status: StageStatus.PENDING,
          orderItemId: item.id,
        };
      })
      .filter((stage) => stage !== null);

    // Adicionar etapa final de entrega
    stages.push({
      id: `stage_${Date.now()}_delivery`,
      type: ProjectStageType.DELIVERY,
      name: 'Entrega',
      description: 'Entrega final ao cliente',
      status: StageStatus.PENDING,
    });

    const projectData = {
      number: projectNumber,
      title: `Produção - ${bookTitle}`,
      description: `Projeto de produção do livro ${bookTitle}`,
      clientId: clientId,
      clientName: clientName,
      bookId: bookId,
      bookTitle: bookTitle,
      orderId: orderId,
      status: ProductionProjectStatus.NOT_STARTED,
      stages: stages,
      progress: 0,
      updates: [],
      estimatedCompletionDate: budget.productionDays
        ? Timestamp.fromDate(new Date(Date.now() + budget.productionDays * 24 * 60 * 60 * 1000))
        : undefined,
      notes: budget.notes,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    };

    const projectRef = await addDoc(collection(db, 'production_projects'), projectData);
    return projectRef.id;
  } catch (error) {
    throw createError('project', 'Failed to create production project', error);
  }
}

// ===== GET NEXT PROJECT NUMBER =====
async function getNextProjectNumber(): Promise<string> {
  try {
    const year = new Date().getFullYear();
    const projectsRef = collection(db, 'production_projects');
    const q = query(
      projectsRef,
      where('number', '>=', `PROJ-${year}-000`),
      where('number', '<=', `PROJ-${year}-999`),
      orderBy('number', 'desc'),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return generateProjectNumber(year, 1);
    }

    const lastNumber = snapshot.docs[0].data().number as string;
    const lastSequential = parseInt(lastNumber.split('-')[2], 10);
    return generateProjectNumber(year, lastSequential + 1);
  } catch (error) {
    console.error('Error getting next project number:', error);
    return generateProjectNumber(new Date().getFullYear(), 1);
  }
}
