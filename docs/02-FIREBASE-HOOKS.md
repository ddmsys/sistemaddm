# Sistema DDM - Firebase e Hooks

> **📅 Última Atualização:** 14 de outubro de 2025  
> **⚠️ MIGRAÇÃO:** useQuotes foi renomeado para useBudgets. Ver [Documento 08](Progress/08-DOCUMENTO%20DE%20MIGRAÇÃO%20E%20PADRONIZAÇÃO.md)

## 🔥 Configuração Firebase

### Estrutura de Configuração

```typescript
// src/lib/firebase/config.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Variáveis de Ambiente (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 📊 Coleções Firestore

### Estrutura das Coleções

```
firestore/
├── users/
│   └── {userId}/
│       ├── id: string
│       ├── email: string
│       ├── name: string
│       ├── role: string
│       └── createdAt: Timestamp
│
├── leads/
│   └── {leadId}/
│       ├── (campos do tipo Lead)
│       └── ownerId: string (referência a users)
│
├── clients/
│   └── {clientId}/
│       ├── (campos do tipo Client)
│       └── clientNumber: number (único)
│
├── budgets/                          ← ✅ ATUALIZADO (era quotes)
│   └── {budgetId}/
│       ├── (campos do tipo Budget)
│       ├── number: string (único)
│       ├── clientId?: string
│       ├── leadId?: string
│       └── createdBy: string
│
├── books/                            ← ✅ NOVO
│   └── {bookId}/
│       ├── (campos do tipo Book)
│       ├── catalogCode: string (único)
│       └── clientId: string
│
├── orders/                           ← ✅ NOVO
│   └── {orderId}/
│       ├── (campos do tipo Order)
│       ├── budgetId: string
│       └── clientId: string
│
├── productionProjects/               ← ✅ NOVO
│   └── {projectId}/
│       ├── (campos do tipo ProductionProject)
│       ├── orderId: string
│       └── bookId: string
│
└── projects/                         ← Gerenciamento CRM
    └── {projectId}/
        ├── (campos do tipo Project)
        ├── clientId: string
        └── teamMembers: Array<{userId, userName, role}>
```

---

## 🎣 Hook Genérico: useFirestore

### Implementação

```typescript
// src/hooks/useFirestore.ts

import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useFirestore<T extends { id?: string }>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Buscar todos os documentos
  const fetchAll = async (constraints: QueryConstraint[] = []) => {
    try {
      setLoading(true);
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData(items);
      setError(null);
      return items;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Buscar por ID
  const getById = async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  // Criar documento
  const create = async (data: Omit<T, 'id'>): Promise<string> => {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await fetchAll();
      return docRef.id;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Atualizar documento
  const update = async (id: string, data: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      await fetchAll();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Deletar documento
  const remove = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      await fetchAll();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    fetchAll();
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    fetchAll,
    getById,
    create,
    update,
    remove,
  };
}
```

---

## 🎯 Hook Especializado: useLeads

### Implementação Completa

```typescript
// src/hooks/comercial/useLeads.ts

import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/hooks/useFirestore';
import { Lead, LeadFormData, LeadStatus } from '@/lib/types/leads';
import { Client, ClientFormData } from '@/lib/types/clients';
import { useAuth } from '@/hooks/useAuth';

export function useLeads() {
  const { user } = useAuth();
  const {
    data: leads,
    loading,
    error,
    create,
    update,
    remove,
  } = useFirestore<Lead>('leads');

  const { create: createClient } = useFirestore<Client>('clients');

  // Criar novo lead
  const createLead = async (data: LeadFormData) => {
    if (!user) throw new Error('Usuário não autenticado');

    const leadData: Omit<Lead, 'id'> = {
      ...data,
      ownerId: user.uid,
      ownerName: user.displayName || user.email || 'Usuário',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await create(leadData);
  };

  // Atualizar lead
  const updateLead = async (id: string, data: Partial<LeadFormData>) => {
    await update(id, data);
  };

  // Atualizar status do lead
  const updateLeadStage = async (id: string, status: LeadStatus) => {
    await update(id, { status });
  };

  // Deletar lead
  const deleteLead = async (id: string) => {
    await remove(id);
  };

  // Converter lead em cliente
  const convertToClient = async (leadId: string, clientData: ClientFormData) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead não encontrado');

    // Criar cliente
    const client: Omit<Client, 'id'> = {
      type: clientData.type,
      name: clientData.name || lead.name,
      email: clientData.email || lead.email,
      phone: clientData.phone || lead.phone,
      document: clientData.document,
      status: 'active',
      clientNumber: Date.now(),
      address: clientData.address,
      tags: clientData.tags || lead.tags,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await createClient(client);

    // Atualizar lead para fechado_ganho
    await updateLeadStage(leadId, 'fechado_ganho');
  };

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    updateLeadStage,
    deleteLead,
    convertToClient,
  };
}
```

### Exemplo de Uso

```typescript
function LeadsPage() {
  const {
    leads,
    loading,
    createLead,
    updateLead,
    updateLeadStage,
    deleteLead,
  } = useLeads();

  const handleCreate = async (data: LeadFormData) => {
    await createLead(data);
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    await updateLeadStage(id, status);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id}>{lead.name}</div>
      ))}
    </div>
  );
}
```

---

## 👥 Hook Especializado: useClients

### Implementação

```typescript
// src/hooks/comercial/useClients.ts

import { Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/hooks/useFirestore';
import { Client, ClientFormData } from '@/lib/types/clients';

export function useClients() {
  const {
    data: clients,
    loading,
    error,
    create,
    update,
    remove,
    getById,
  } = useFirestore<Client>('clients');

  const createClient = async (data: ClientFormData) => {
    const clientData: Omit<Client, 'id'> = {
      ...data,
      status: 'active',
      clientNumber: Date.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await create(clientData);
  };

  const updateClient = async (id: string, data: Partial<ClientFormData>) => {
    await update(id, data);
  };

  const deleteClient = async (id: string) => {
    await remove(id);
  };

  const getClientById = async (id: string) => {
    return await getById(id);
  };

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
  };
}
```

---

## 📁 Hook Especializado: useProjects

### Implementação

```typescript
// src/hooks/comercial/useProjects.ts

import { Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/hooks/useFirestore';
import { Project, ProjectFormData, ProjectStatus } from '@/lib/types/projects';
import { useAuth } from '@/hooks/useAuth';

export function useProjects() {
  const { user } = useAuth();
  const {
    data: projects,
    loading,
    error,
    create,
    update,
    remove,
  } = useFirestore<Project>('projects');

  const createProject = async (data: ProjectFormData) => {
    const projectData: Omit<Project, 'id'> = {
      ...data,
      startDate: Timestamp.fromDate(data.startDate),
      endDate: data.endDate ? Timestamp.fromDate(data.endDate) : undefined,
      progress: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await create(projectData);
  };

  const updateProject = async (id: string, data: Partial<ProjectFormData>) => {
    const updateData: any = { ...data };

    if (data.startDate) {
      updateData.startDate = Timestamp.fromDate(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = Timestamp.fromDate(data.endDate);
    }

    await update(id, updateData);
  };

  const updateProjectStatus = async (id: string, status: ProjectStatus) => {
    await update(id, { status });
  };

  const updateProjectProgress = async (id: string, progress: number) => {
    await update(id, { progress });
  };

  const deleteProject = async (id: string) => {
    await remove(id);
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    updateProjectStatus,
    updateProjectProgress,
    deleteProject,
  };
}
```

---

## 💰 Hook Especializado: useBudgets

> ✅ **ATUALIZADO** - Substitui useQuotes desde 14/10/2025

### Implementação

```typescript
// src/hooks/comercial/useBudgets.ts

import { Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/hooks/useFirestore';
import { Budget, BudgetFormData, BudgetStatus, BudgetItem } from '@/lib/types/budgets';
import { useAuth } from '@/hooks/useAuth';

export function useBudgets() {
  const { user } = useAuth();
  const {
    data: budgets,
    loading,
    error,
    create,
    update,
    remove,
  } = useFirestore<Budget>('budgets');

  const calculateSubtotal = (items: BudgetItem[]): number => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTotal = (
    subtotal: number,
    discount?: number,
    discountPercentage?: number
  ): number => {
    let total = subtotal;

    if (discountPercentage) {
      total -= (subtotal * discountPercentage) / 100;
    }

    if (discount) {
      total -= discount;
    }

    return Math.max(0, total);
  };

  const createBudget = async (data: BudgetFormData) => {
    if (!user) throw new Error('Usuário não autenticado');

    const subtotal = calculateSubtotal(data.items);
    const total = calculateTotal(subtotal, data.discount, data.discountPercentage);

    // Gerar número do orçamento: v5_1310.1435
    const now = new Date();
    const year = now.getFullYear();
    const versionYear = `v${year - 2020}`;
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const number = `${versionYear}_${day}${month}.${hour}${minute}`;

    const budgetData: Omit<Budget, 'id'> = {
      number,
      version: 1,
      leadId: data.leadId,
      clientId: data.clientId,
      bookId: data.bookId,
      projectType: data.projectType,
      projectData: data.projectData,
      items: data.items.map((item, index) => ({
        ...item,
        id: `item-${index + 1}`,
        totalPrice: item.quantity * item.unitPrice,
      })),
      subtotal,
      discount: data.discount,
      discountPercentage: data.discountPercentage,
      total,
      paymentMethods: data.paymentMethods,
      validityDays: data.validityDays,
      productionDays: data.productionDays,
      clientProvidedMaterial: data.clientProvidedMaterial,
      materialDescription: data.materialDescription,
      notes: data.notes,
      status: 'draft',
      issueDate: Timestamp.now(),
      expiryDate: Timestamp.fromDate(
        new Date(Date.now() + data.validityDays * 24 * 60 * 60 * 1000)
      ),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: user.uid,
    };

    await create(budgetData);
  };

  const updateBudget = async (id: string, data: Partial<BudgetFormData>) => {
    const updateData: any = { ...data };

    // Recalcular totais se itens mudaram
    if (data.items) {
      const subtotal = calculateSubtotal(data.items as BudgetItem[]);
      const total = calculateTotal(
        subtotal,
        data.discount,
        data.discountPercentage
      );
      updateData.subtotal = subtotal;
      updateData.total = total;
    }

    await update(id, updateData);
  };

  const updateBudgetStatus = async (id: string, status: BudgetStatus) => {
    const updateData: any = { status };

    if (status === 'approved') {
      updateData.approvalDate = Timestamp.now();
    }

    await update(id, updateData);
  };

  const deleteBudget = async (id: string) => {
    await remove(id);
  };

  return {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    updateBudgetStatus,
    deleteBudget,
  };
}
```

### Exemplo de Uso

```typescript
function BudgetsPage() {
  const {
    budgets,
    loading,
    createBudget,
    updateBudget,
    updateBudgetStatus,
    deleteBudget,
  } = useBudgets();

  const handleCreate = async (data: BudgetFormData) => {
    await createBudget(data);
  };

  const handleApprove = async (id: string) => {
    await updateBudgetStatus(id, 'approved');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {budgets.map(budget => (
        <div key={budget.id}>
          {budget.number} - R$ {budget.total.toFixed(2)}
        </div>
      ))}
    </div>
  );
}
```

---

## 📈 Hook de Métricas: useCommercialMetrics

### Implementação

```typescript
// src/hooks/comercial/useCommercialMetrics.ts

import { useState, useEffect } from 'react';
import { useLeads } from './useLeads';
import { useProjects } from './useProjects';
import { useBudgets } from './useBudgets';  // ✅ Atualizado
import {
  CommercialMetrics,
  RevenueData,
  FunnelData,
  SourceData,
  StatusData,
} from '@/lib/types/metrics';

export function useCommercialMetrics() {
  const { leads } = useLeads();
  const { projects } = useProjects();
  const { budgets } = useBudgets();  // ✅ Atualizado
  const [metrics, setMetrics] = useState<CommercialMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMetrics = () => {
      // Calcular receita mensal
      const monthlyRevenue = budgets  // ✅ Atualizado
        .filter(b => b.status === 'approved')
        .reduce((sum, b) => sum + b.total, 0);

      // Contar leads ativos
      const activeLeads = leads.filter(
        l => !['fechado_ganho', 'fechado_perdido'].includes(l.status)
      ).length;

      // Contar orçamentos
      const totalBudgets = budgets.length;  // ✅ Atualizado

      // Calcular taxa de conversão
      const closedLeads = leads.filter(l => l.status === 'fechado_ganho').length;
      const conversionRate = leads.length > 0 ? (closedLeads / leads.length) * 100 : 0;

      // Dados de receita (mock - implementar lógica real)
      const revenueData: RevenueData[] = [
        { period: 'Jan', revenue: 50000, expenses: 30000, profit: 20000 },
        { period: 'Fev', revenue: 60000, expenses: 35000, profit: 25000 },
        { period: 'Mar', revenue: 55000, expenses: 32000, profit: 23000 },
      ];

      // Dados do funil
      const funnelData: FunnelData[] = [
        {
          status: 'primeiro_contato',
          count: leads.filter(l => l.status === 'primeiro_contato').length,
          value: leads.filter(l => l.status === 'primeiro_contato').reduce((s, l) => s + (l.value || 0), 0),
          percentage: 100,
        },
        // ... outros status
      ];

      // Leads por fonte
      const leadsBySource: SourceData[] = [
        {
          source: 'website',
          count: leads.filter(l => l.source === 'website').length,
          percentage: 0,
          label: 'Website',
        },
        // ... outras fontes
      ];

      // Orçamentos por status
      const quotesByStatus: StatusData[] = [
        {
          status: 'draft',
          count: quotes.filter(q => q.status === 'draft').length,
          value: quotes.filter(q => q.status === 'draft').reduce((s, q) => s + q.total, 0),
          percentage: 0,
          label: 'Rascunho',
        },
        // ... outros status
      ];

      // Projetos críticos
      const criticalProjects = projects.filter(
        p => p.status === 'in_progress' && p.priority === 'urgent'
      );

      setMetrics({
        monthlyRevenue,
        activeLeads,
        totalQuotes,
        conversionRate,
        revenueData,
        funnelData,
        leadsBySource,
        quotesByStatus,
        criticalProjects,
      });

      setLoading(false);
    };

    calculateMetrics();
  }, [leads, projects, quotes]);

  return { metrics, loading };
}
```

---

## 🔐 Hook de Autenticação: useAuth

### Implementação

```typescript
// src/hooks/useAuth.tsx

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

> **💡 IMPORTANTE:** Todos os hooks já estão implementados e prontos para uso!
