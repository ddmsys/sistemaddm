// src/hooks/comercial/useBudgets.ts

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
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  Budget,
  BudgetItem,
  BudgetStatus,
  calculateSubtotal,
  calculateTotal,
} from "@/lib/types/budgets";
import { getUserId } from "@/lib/utils/user-helper";

// ✅ Função helper
const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

// ✅ Função helper
const canApprove = (budget: Budget): boolean => {
  return budget.status === "sent" && budget.items.length > 0;
};

// ==================== INTERFACES ====================

interface UseBudgetsOptions {
  leadId?: string;
  clientId?: string;
  bookId?: string;
  status?: BudgetStatus;
  realtime?: boolean;
}

interface BudgetFormData {
  projectTitle: string;
  clientId?: string;
  leadId?: string;
  items: Omit<BudgetItem, "id" | "totalPrice">[];
  validityDays: number;
  paymentMethods: string[];
  clientProvidedMaterial: boolean;
  materialDescription?: string;
  notes?: string;
  bookId?: string;
  projectData?: {
    title: string;
    subtitle?: string;
    author?: string;
    specifications?: any;
  };
  discount?: number;
  discountPercentage?: number;
  productionDays?: number;
  projectType?: any;
}

export interface UseBudgetsReturn {
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
  updateBudgetStatus: (id: string, status: BudgetStatus) => Promise<void>;
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
      const budgetsRef = collection(db, "budgets");
      const constraints: QueryConstraint[] = [];

      if (leadId) {
        constraints.push(where("leadId", "==", leadId));
      }

      if (clientId) {
        constraints.push(where("clientId", "==", clientId));
      }

      if (bookId) {
        constraints.push(where("bookId", "==", bookId));
      }

      if (status) {
        constraints.push(where("status", "==", status));
      }

      constraints.push(orderBy("createdAt", "desc"));

      const q = query(budgetsRef, ...constraints);

      if (realtime) {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const budgetsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate?.() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
              issueDate: doc.data().issueDate?.toDate?.() || new Date(),
              expiryDate: doc.data().expiryDate?.toDate?.() || new Date(),
              validUntil: doc.data().validUntil?.toDate?.() || null,
              approvalDate: doc.data().approvalDate?.toDate?.() || null,
              sentAt: doc.data().sentAt?.toDate?.() || null,
              viewedAt: doc.data().viewedAt?.toDate?.() || null,
            })) as Budget[];

            setBudgets(budgetsData);
            setLoading(false);
          },
          (err) => {
            console.error("Error loading budgets:", err);
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
              createdAt: doc.data().createdAt?.toDate?.() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
              issueDate: doc.data().issueDate?.toDate?.() || new Date(),
              expiryDate: doc.data().expiryDate?.toDate?.() || new Date(),
              validUntil: doc.data().validUntil?.toDate?.() || null,
              approvalDate: doc.data().approvalDate?.toDate?.() || null,
              sentAt: doc.data().sentAt?.toDate?.() || null,
              viewedAt: doc.data().viewedAt?.toDate?.() || null,
            })) as Budget[];

            setBudgets(budgetsData);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error loading budgets:", err);
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error setting up budgets query:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [user, leadId, clientId, bookId, status, realtime]);

  // ===== CREATE BUDGET =====
  const createBudget = async (data: BudgetFormData): Promise<string> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const userId = getUserId(user);

      // ✅ Processar itens
      const processedItems = data.items.map((item) => ({
        ...item,
        id: `item_${Date.now()}_${Math.random()}`,
        totalPrice: calculateItemTotal(item.quantity, item.unitPrice),
      })) as BudgetItem[];

      const subtotal = calculateSubtotal(processedItems);
      const total = calculateTotal(subtotal, data.discount, data.discountPercentage);

      const now = Timestamp.now();
      const validityDays = data.validityDays || 30;
      const expiryDate = new Date(now.toMillis());
      expiryDate.setDate(expiryDate.getDate() + validityDays);

      // 🔥 BUSCAR NOME DO CLIENTE OU LEAD
      let clientName = "";

      if (data.clientId) {
        const clientDoc = await getDoc(doc(db, "clients", data.clientId));
        if (clientDoc.exists()) {
          const clientData = clientDoc.data();
          clientName = clientData.name || "";
        }
      } else if (data.leadId) {
        const leadDoc = await getDoc(doc(db, "leads", data.leadId));
        if (leadDoc.exists()) {
          const leadData = leadDoc.data();
          clientName = leadData.name || "";
        }
      }

      // 🔥 CONSTRUIR OBJETO SEM NENHUM CAMPO UNDEFINED
      const budgetData: any = {
        number: "", // Firebase Function vai preencher
        version: 1,
        clientName,
        projectTitle: data.projectTitle,
        description: "",
        projectType: data.projectType,
        items: processedItems,
        subtotal,
        total,
        totals: {
          total,
          ...(data.discount ? { discount: data.discount } : {}),
        },
        grandTotal: total,
        paymentMethods: data.paymentMethods,
        validityDays: validityDays,
        clientProvidedMaterial: data.clientProvidedMaterial,
        status: "draft" as BudgetStatus,
        issueDate: now,
        expiryDate: Timestamp.fromDate(expiryDate),
        validUntil: Timestamp.fromDate(expiryDate),
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      };

      // 🔥 SÓ ADICIONAR CAMPOS SE TIVEREM VALOR (não undefined)
      if (data.leadId) budgetData.leadId = data.leadId;
      if (data.clientId) budgetData.clientId = data.clientId;
      if (data.bookId) budgetData.bookId = data.bookId;
      if (data.projectData) budgetData.projectData = data.projectData;
      if (data.discount && data.discount > 0) budgetData.discount = data.discount;
      if (data.discountPercentage && data.discountPercentage > 0) {
        budgetData.discountPercentage = data.discountPercentage;
      }
      if (data.productionDays && data.productionDays > 0) {
        budgetData.productionDays = data.productionDays;
      }
      if (data.materialDescription?.trim()) {
        budgetData.materialDescription = data.materialDescription.trim();
      }
      if (data.notes?.trim()) {
        budgetData.notes = data.notes.trim();
      }

      console.log("✅ Salvando orçamento:", budgetData);

      const budgetsRef = collection(db, "budgets");
      const docRef = await addDoc(budgetsRef, budgetData);

      console.log("✅ Orçamento salvo com ID:", docRef.id);

      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error("❌ Erro ao criar orçamento:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE BUDGET =====
  const updateBudget = async (id: string, data: Partial<Budget>): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const updateData: Record<string, any> = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      if (data.items) {
        const subtotal = calculateSubtotal(data.items);
        updateData.subtotal = subtotal;
        updateData.total = calculateTotal(subtotal, data.discount, data.discountPercentage);
      }

      const budgetRef = doc(db, "budgets", id);
      await updateDoc(budgetRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating budget:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== DELETE BUDGET =====
  const deleteBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const budgetRef = doc(db, "budgets", id);
      await deleteDoc(budgetRef);
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting budget:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== SEND BUDGET =====
  const sendBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const budgetRef = doc(db, "budgets", id);
      await updateDoc(budgetRef, {
        status: "sent" as BudgetStatus,
        sentAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error sending budget:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== APPROVE BUDGET =====
  const approveBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const budgetDoc = await getDoc(doc(db, "budgets", id));

      if (!budgetDoc.exists()) {
        throw new Error("Budget not found");
      }

      const budget = {
        id: budgetDoc.id,
        ...budgetDoc.data(),
      } as Budget;

      if (!canApprove(budget)) {
        throw new Error("Budget cannot be approved");
      }

      const budgetRef = doc(db, "budgets", id);
      await updateDoc(budgetRef, {
        status: "approved" as BudgetStatus,
        approvalDate: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error approving budget:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== REJECT BUDGET =====
  const rejectBudget = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const budgetRef = doc(db, "budgets", id);
      await updateDoc(budgetRef, {
        status: "rejected" as BudgetStatus,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error rejecting budget:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE BUDGET STATUS =====
  const updateBudgetStatus = async (id: string, status: BudgetStatus): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const updateData: Record<string, any> = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (status === "sent") {
        updateData.sentAt = Timestamp.now();
      } else if (status === "approved") {
        updateData.approvalDate = Timestamp.now();
      } else if (status === "rejected") {
        updateData.rejectedDate = Timestamp.now();
      }

      const budgetRef = doc(db, "budgets", id);
      await updateDoc(budgetRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating budget status:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== GET BUDGET BY ID =====
  const getBudgetById = async (id: string): Promise<Budget | null> => {
    try {
      const budgetDoc = await getDoc(doc(db, "budgets", id));

      if (!budgetDoc.exists()) {
        return null;
      }

      return {
        id: budgetDoc.id,
        ...budgetDoc.data(),
        createdAt: budgetDoc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: budgetDoc.data().updatedAt?.toDate?.() || new Date(),
        issueDate: budgetDoc.data().issueDate?.toDate?.() || new Date(),
        expiryDate: budgetDoc.data().expiryDate?.toDate?.() || new Date(),
        validUntil: budgetDoc.data().validUntil?.toDate?.() || null,
        approvalDate: budgetDoc.data().approvalDate?.toDate?.() || null,
        sentAt: budgetDoc.data().sentAt?.toDate?.() || null,
        viewedAt: budgetDoc.data().viewedAt?.toDate?.() || null,
      } as Budget;
    } catch (err) {
      const error = err as Error;
      console.error("Error getting budget:", error);
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
    updateBudgetStatus,
  };
}
