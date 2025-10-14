// src/hooks/commercial/useBudgets.ts

// Hook para gerenciamento de orçamentos

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import {
  Budget,
  BudgetFormData,
  BudgetItem,
  BudgetStatus,
  calculateItemTotal,
  calculateSubtotal,
  calculateTotal,
  canApprove,
  generateBudgetNumber,
  validateBudget,
} from '@/lib/types/budgets';
import { getUserId } from '@/lib/utils/user-helper';

// ==================== INTERFACES ====================

interface UseBudgetsOptions {
  leadId?: string;
  clientId?: string;
  bookId?: string;
  status?: BudgetStatus;
  realtime?: boolean;
}

interface UseBudgetsReturn {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  createBudget: (data: BudgetFormData) => Promise<string>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  sendBudget: (id: string) => Promise<void>;
  approveBudget: (id: string) => Promise<void>;
  rejectBudget: (id: string) => Promise<void>;
  getBudgetById: (id: string) => Promise<Budget | null>;
}

// ==================== HOOK ====================

export function useBudgets(options: UseBudgetsOptions = {}): UseBudgetsReturn {
  const { leadId, clientId, bookId, status, realtime = true } = options;
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== LOAD BUDGETS =====
  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const budgetsRef = collection(db, 'budgets');
      const constraints: QueryConstraint[] = [];

      // ✅ Filtros flexíveis
      if (leadId) {
        constraints.push(where('leadId', '==', leadId));
      }

      if (clientId) {
        constraints.push(where('clientId', '==', clientId));
      }

      if (bookId) {
        constraints.push(where('bookId', '==', bookId));
      }

      if (status) {
        constraints.push(where('status', '==', status));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(budgetsRef, ...constraints);

      if (realtime) {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const budgetsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Budget[];

            setBudgets(budgetsData);
            setLoading(false);
          },
          (err) => {
            console.error('Error loading budgets:', err);
            setError(err.message);
            setLoading(false);
          },
        );

        return () => unsubscribe();
      } else {
        getDocs(q)
          .then((snapshot) => {
            const budgetsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Budget[];

            setBudgets(budgetsData);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error loading budgets:', err);
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error setting up budgets query:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [user, leadId, clientId, bookId, status, realtime]);

  // ===== CREATE BUDGET =====
  const createBudget = async (data: BudgetFormData): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // ✅ Validação inteligente
      const validationErrors = validateBudget(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      const userId = getUserId(user);
      const budgetNumber = generateBudgetNumber();

      // ✅ Processar itens com totalPrice calculado
      const processedItems = data.items.map((item) => ({
        ...item,
        id: `item_${Date.now()}_${Math.random()}`,
        totalPrice: calculateItemTotal(item.quantity, item.unitPrice),
      })) as BudgetItem[]; // ← Cast explícito

      const subtotal = calculateSubtotal(processedItems);
      const total = calculateTotal(subtotal, data.discount, data.discountPercentage);

      const now = Timestamp.now();
      const validityDays = data.validityDays || 30;
      const expiryDate = new Date(now.toMillis());
      expiryDate.setDate(expiryDate.getDate() + validityDays);

      // ✅ Criar orçamento com campos opcionais
      const budgetData: Omit<Budget, 'id'> = {
        number: budgetNumber,
        version: 1,

        // Relacionamentos (opcionais)
        leadId: data.leadId,
        clientId: data.clientId,
        bookId: data.bookId,

        // Tipo e dados do projeto
        projectType: data.projectType,
        projectData: data.projectData,

        // Itens e valores
        items: processedItems,
        subtotal,
        discount: data.discount,
        discountPercentage: data.discountPercentage,
        total,

        // Condições
        paymentMethods: data.paymentMethods,
        validityDays: validityDays,
        productionDays: data.productionDays,
        clientProvidedMaterial: data.clientProvidedMaterial,
        materialDescription: data.materialDescription,
        notes: data.notes,

        // Status
        status: 'draft',

        // Datas
        issueDate: now,
        expiryDate: Timestamp.fromDate(expiryDate),

        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      };

      const budgetsRef = collection(db, 'budgets');
      const docRef = await addDoc(budgetsRef, budgetData);

      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating budget:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE BUDGET =====
  const updateBudget = async (id: string, data: Partial<Budget>): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const updateData: Record<string, any> = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      // Recalcular valores se items mudou
      if (data.items) {
        const subtotal = calculateSubtotal(data.items);
        updateData.subtotal = subtotal;
        updateData.total = calculateTotal(subtotal, data.discount, data.discountPercentage);
      }

      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error('Error updating budget:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== DELETE BUDGET =====
  const deleteBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const budgetRef = doc(db, 'budgets', id);
      await deleteDoc(budgetRef);
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting budget:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== SEND BUDGET =====
  const sendBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, {
        status: 'sent',
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error sending budget:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== APPROVE BUDGET =====
  const approveBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const budgetDoc = await getDoc(doc(db, 'budgets', id));

      if (!budgetDoc.exists()) {
        throw new Error('Budget not found');
      }

      const budget = budgetDoc.data() as Budget;

      if (!canApprove(budget)) {
        throw new Error('Budget cannot be approved');
      }

      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, {
        status: 'approved',
        approvalDate: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // ✅ TODO: Aqui vai chamar a função de conversão
      // await convertBudgetToOrder(id);
    } catch (err) {
      const error = err as Error;
      console.error('Error approving budget:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== REJECT BUDGET =====
  const rejectBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, {
        status: 'rejected',
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error rejecting budget:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== GET BUDGET BY ID =====
  const getBudgetById = async (id: string): Promise<Budget | null> => {
    try {
      const budgetDoc = await getDoc(doc(db, 'budgets', id));

      if (!budgetDoc.exists()) {
        return null;
      }

      return {
        id: budgetDoc.id,
        ...budgetDoc.data(),
      } as Budget;
    } catch (err) {
      const error = err as Error;
      console.error('Error getting budget:', error);
      throw error;
    }
  };

  return {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    sendBudget,
    approveBudget,
    rejectBudget,
    getBudgetById,
  };
}
