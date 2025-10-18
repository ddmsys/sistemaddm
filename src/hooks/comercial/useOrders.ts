// src/hooks/comercial/useOrders.ts
// ✅ SEU ARQUIVO ORIGINAL COMPLETO (440 linhas) + apenas correções de tipo

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
import { Budget } from "@/lib/types/budgets";
import {
  calculateAmountDue,
  calculatePaymentStatus,
  canCancelOrder,
  canConfirmOrder,
  createOrderFromBudget,
  generateOrderNumber,
  Order,
  OrderFormData,
  OrderStatus, // ✅ Usando enum
  Payment,
} from "@/lib/types/orders";
import { getUserId } from "@/lib/utils/user-helper";

// ==================== INTERFACES ====================

interface UseOrdersOptions {
  clientId?: string;
  bookId?: string;
  budgetId?: string;
  status?: OrderStatus;
  realtime?: boolean;
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (data: OrderFormData) => Promise<string>;
  createOrderFromBudgetId: (budgetId: string) => Promise<string>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  confirmOrder: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  addPayment: (orderId: string, payment: Omit<Payment, "id" | "date">) => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
}

// ==================== HOOK ====================

export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const { clientId, bookId, budgetId, status, realtime = true } = options;
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== LOAD ORDERS =====
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ordersRef = collection(db, "orders");
      const constraints: QueryConstraint[] = [];

      if (clientId) {
        constraints.push(where("clientId", "==", clientId));
      }

      if (bookId) {
        constraints.push(where("bookId", "==", bookId));
      }

      if (budgetId) {
        constraints.push(where("budgetId", "==", budgetId));
      }

      if (status) {
        constraints.push(where("status", "==", status));
      }

      constraints.push(orderBy("createdAt", "desc"));
      const q = query(ordersRef, ...constraints);

      if (realtime) {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              // ✅ Converter Timestamps
              createdAt: doc.data().createdAt?.toDate?.() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
              issueDate: doc.data().issueDate?.toDate?.() || new Date(),
              deliveryDate: doc.data().deliveryDate?.toDate?.() || null,
              completedDate: doc.data().completedDate?.toDate?.() || null,
              // ✅ Converter payments dates
              payments: (doc.data().payments || []).map((payment: any) => ({
                ...payment,
                date: payment.date?.toDate?.() || new Date(),
              })),
            })) as Order[];
            setOrders(ordersData);
            setLoading(false);
          },
          (err) => {
            console.error("Error loading orders:", err);
            setError(err.message);
            setLoading(false);
          },
        );

        return () => unsubscribe();
      } else {
        getDocs(q)
          .then((snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              // ✅ Converter Timestamps
              createdAt: doc.data().createdAt?.toDate?.() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
              issueDate: doc.data().issueDate?.toDate?.() || new Date(),
              deliveryDate: doc.data().deliveryDate?.toDate?.() || null,
              completedDate: doc.data().completedDate?.toDate?.() || null,
              // ✅ Converter payments dates
              payments: (doc.data().payments || []).map((payment: any) => ({
                ...payment,
                date: payment.date?.toDate?.() || new Date(),
              })),
            })) as Order[];
            setOrders(ordersData);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error loading orders:", err);
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error setting up orders query:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [user, clientId, bookId, budgetId, status, realtime]);

  // ===== CREATE ORDER =====
  const createOrder = async (data: OrderFormData): Promise<string> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const userId = getUserId(user);
      const orderNumber = generateOrderNumber();
      const now = Timestamp.now();

      // ✅ Calcular totalPrice para cada item (estava faltando)
      const itemsWithTotal = data.items.map((item) => ({
        ...item,
        id: `item_${Date.now()}_${Math.random()}`,
        totalPrice: item.quantity * item.unitPrice, // ✅ ADICIONADO
      }));

      const subtotal = itemsWithTotal.reduce((sum, item) => sum + item.totalPrice, 0);
      const total = subtotal - (data.discount || 0);

      const orderData: Omit<Order, "id"> = {
        number: orderNumber,
        clientId: data.clientId,
        clientName: "", // ✅ Será preenchido por query ou form
        projectTitle: "", // ✅ Será preenchido por query ou form
        bookCode: "", // ✅ Será preenchido por query
        totalValue: total, // ✅ Campo obrigatório
        deadline: 0, // ✅ Será calculado baseado em deliveryDate
        bookId: data.bookId,
        budgetId: data.budgetId || "",
        items: itemsWithTotal,
        subtotal,
        discount: data.discount,
        total,
        payments: [],
        paymentStatus: "pending",
        amountPaid: 0,
        amountDue: total,
        paymentMethods: data.paymentMethods,
        status: OrderStatus.PENDING, // ✅ Usando enum
        notes: data.notes,
        issueDate: now,
        deliveryDate: data.deliveryDate ? Timestamp.fromDate(data.deliveryDate) : undefined,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      };

      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, orderData);
      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error("Error creating order:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== CREATE ORDER FROM BUDGET =====
  const createOrderFromBudgetId = async (budgetId: string): Promise<string> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const budgetDoc = await getDoc(doc(db, "budgets", budgetId));
      if (!budgetDoc.exists()) {
        throw new Error("Budget not found");
      }

      const budget = { id: budgetDoc.id, ...budgetDoc.data() } as Budget;

      // ✅ Validação antes de criar
      if (!budget.clientId) {
        throw new Error("Budget must have clientId");
      }

      if (!budget.bookId) {
        throw new Error("Budget must have bookId");
      }

      // Buscar dados do cliente e livro
      const clientDoc = await getDoc(doc(db, "clients", budget.clientId));
      const bookDoc = await getDoc(doc(db, "books", budget.bookId));

      const clientName = clientDoc.exists() ? clientDoc.data()?.name : undefined;
      const bookTitle = bookDoc.exists() ? bookDoc.data()?.title : undefined;

      const orderData = createOrderFromBudget(budget, clientName, bookTitle);
      const orderNumber = generateOrderNumber();
      const userId = getUserId(user);

      const completeOrderData: Omit<Order, "id"> = {
        ...orderData,
        number: orderNumber,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userId,
      };

      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, completeOrderData);
      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error("Error creating order from budget:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE ORDER =====
  const updateOrder = async (id: string, data: Partial<Order>): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const updateData: Record<string, any> = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating order:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== DELETE ORDER =====
  const deleteOrder = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const orderRef = doc(db, "orders", id);
      await deleteDoc(orderRef);
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting order:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== CONFIRM ORDER =====
  const confirmOrder = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const orderDoc = await getDoc(doc(db, "orders", id));
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const order = orderDoc.data() as Order;

      if (!canConfirmOrder(order)) {
        throw new Error("Order cannot be confirmed");
      }

      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, {
        status: OrderStatus.CONFIRMED, // ✅ Usando enum
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error confirming order:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== CANCEL ORDER =====
  const cancelOrder = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const orderDoc = await getDoc(doc(db, "orders", id));
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const order = orderDoc.data() as Order;

      if (!canCancelOrder(order)) {
        throw new Error("Order cannot be cancelled");
      }

      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, {
        status: OrderStatus.CANCELLED, // ✅ Usando enum
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error cancelling order:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== ADD PAYMENT =====
  const addPayment = async (
    orderId: string,
    payment: Omit<Payment, "id" | "date">,
  ): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId));
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const order = orderDoc.data() as Order;

      const newPayment: Payment = {
        id: `payment_${Date.now()}`,
        ...payment,
        date: Timestamp.now(),
      };

      const updatedPayments = [...order.payments, newPayment];
      const amountPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const paymentStatus = calculatePaymentStatus(order.total, amountPaid);
      const amountDue = calculateAmountDue(order.total, amountPaid);

      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        payments: updatedPayments,
        paymentStatus,
        amountPaid,
        amountDue,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error adding payment:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== GET ORDER BY ID =====
  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const orderDoc = await getDoc(doc(db, "orders", id));
      if (!orderDoc.exists()) {
        return null;
      }

      return {
        id: orderDoc.id,
        ...orderDoc.data(),
        // ✅ Converter Timestamps
        createdAt: orderDoc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: orderDoc.data().updatedAt?.toDate?.() || new Date(),
        issueDate: orderDoc.data().issueDate?.toDate?.() || new Date(),
        deliveryDate: orderDoc.data().deliveryDate?.toDate?.() || null,
        completedDate: orderDoc.data().completedDate?.toDate?.() || null,
        // ✅ Converter payments dates
        payments: (orderDoc.data().payments || []).map((payment: any) => ({
          ...payment,
          date: payment.date?.toDate?.() || new Date(),
        })),
      } as Order;
    } catch (err) {
      const error = err as Error;
      console.error("Error getting order:", error);
      throw error;
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    createOrderFromBudgetId,
    updateOrder,
    deleteOrder,
    confirmOrder,
    cancelOrder,
    addPayment,
    getOrderById,
  };
}
