# 📋 COMPONENTES FALTANTES - MÓDULO PROJECTS

**Data:** 16 de outubro de 2025  
**Status:** Análise Completa

---

## ✅ O QUE JÁ EXISTE

### **1. Types**

- ✅ `src/lib/types/projects.ts` - Completo com todas as interfaces

### **2. Páginas**

- ✅ `src/app/(authenticated)/crm/projects/page.tsx` - Lista de projetos
- ✅ `src/app/(authenticated)/crm/projects/[id]/page.tsx` - Detalhes do projeto

### **3. Componentes UI**

- ✅ `src/components/comercial/cards/ProjectCard.tsx` - Card de projeto
- ✅ `src/components/comercial/modals/ProjectModal.tsx` - Modal de criação/edição
- ✅ `src/components/comercial/tables/ProjectsTable.tsx` - Tabela de projetos

### **4. Cloud Functions**

- ✅ `functions/src/projects/assignProjectCatalogCode.ts` - Atribuir código
- ✅ `functions/src/projects/onProjectApproval.ts` - Trigger de aprovação

---

## ❌ O QUE ESTÁ FALTANDO

### **1. Hook Principal - URGENTE** ⚠️

```
📁 src/hooks/comercial/useProjects.ts
```

**Descrição:** Hook para gerenciar CRUD de projetos  
**Funções necessárias:**

- `getProjects()` - Listar todos os projetos
- `getProjectById(id)` - Buscar projeto por ID
- `createProject(data)` - Criar novo projeto
- `updateProject(id, data)` - Atualizar projeto
- `deleteProject(id)` - Deletar projeto
- `getProjectsByClient(clientId)` - Projetos por cliente
- `getProjectsByStatus(status)` - Projetos por status
- Queries em tempo real com `realtime: true`

**Baseado em:**

- `useBudgets.ts` (mesmo padrão)
- `useLeads.ts` (mesmo padrão)
- Coleção Firestore: `projects`

---

### **2. Componente de Lista - MÉDIA PRIORIDADE** 📊

```
📁 src/components/comercial/projects/ProjectsList.tsx
```

**Descrição:** Lista completa de projetos com filtros  
**Funcionalidades:**

- Grid de ProjectCard
- Filtros por status, priority, product
- Busca por título
- Ordenação
- Paginação
- Botão "Novo Projeto"

**Props:**

```typescript
interface ProjectsListProps {
  projects: Project[];
  loading?: boolean;
  onCreate: (data: ProjectFormData) => Promise<void>;
  onUpdate: (id: string, data: Partial<Project>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
```

---

### **3. Componente de Filtros - BAIXA PRIORIDADE** 🔍

```
📁 src/components/comercial/filters/ProjectFilters.tsx
```

**Descrição:** Barra de filtros para projetos  
**Filtros:**

- Status (select)
- Prioridade (select)
- Tipo de produto (select)
- Responsável (select)
- Intervalo de datas
- Busca por texto

**Props:**

```typescript
interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFilterChange: (filters: ProjectFilters) => void;
  onClear: () => void;
}
```

---

### **4. Componente de Timeline - BAIXA PRIORIDADE** 📅

```
📁 src/components/comercial/projects/ProjectTimeline.tsx
```

**Descrição:** Linha do tempo do projeto  
**Exibe:**

- Eventos e marcos
- Atualizações
- Aprovações
- Problemas
- Ordenado por data

**Props:**

```typescript
interface ProjectTimelineProps {
  timeline: ProjectTimeline[];
  onAddEvent: (event: Omit<ProjectTimeline, 'id'>) => void;
}
```

---

### **5. Componente de Tarefas - BAIXA PRIORIDADE** ✅

```
📁 src/components/comercial/projects/ProjectTasks.tsx
```

**Descrição:** Lista de tarefas do projeto  
**Funcionalidades:**

- Criar/editar/deletar tarefas
- Marcar como concluída
- Atribuir responsável
- Definir prazo
- Exibir dependências

**Props:**

```typescript
interface ProjectTasksProps {
  tasks: ProjectTask[];
  onAddTask: (task: Omit<ProjectTask, 'id'>) => void;
  onUpdateTask: (id: string, data: Partial<ProjectTask>) => void;
  onDeleteTask: (id: string) => void;
}
```

---

### **6. Componente de Arquivos - BAIXA PRIORIDADE** 📎

```
📁 src/components/comercial/projects/ProjectFiles.tsx
```

**Descrição:** Gerenciador de arquivos do projeto  
**Funcionalidades:**

- Upload de arquivos
- Lista de arquivos por categoria
- Download
- Preview
- Delete

**Props:**

```typescript
interface ProjectFilesProps {
  files: ProjectFile[];
  onUpload: (file: File, category: ProjectFile['category']) => Promise<void>;
  onDelete: (fileId: string) => void;
}
```

---

### **7. Serviços Firebase - MÉDIA PRIORIDADE** 🔥

```
📁 src/lib/firebase/projects/createProject.ts
📁 src/lib/firebase/projects/updateProject.ts
📁 src/lib/firebase/projects/deleteProject.ts
📁 src/lib/firebase/projects/getProjects.ts
```

**Descrição:** Funções helper para operações no Firestore  
**Funções:**

- Criar projeto com validação
- Atualizar com timestamps
- Deletar com verificações
- Queries otimizadas

---

## 📝 ORDEM DE IMPLEMENTAÇÃO SUGERIDA

### **Fase 1 - ESSENCIAL** (Fazer agora)

1. ✅ **useProjects.ts** - Hook principal (URGENTE)
2. ✅ **ProjectsList.tsx** - Componente de lista

### **Fase 2 - COMPLEMENTAR** (Próxima sprint)

3. ✅ **ProjectFilters.tsx** - Filtros avançados
4. ✅ Serviços Firebase helpers

### **Fase 3 - AVANÇADO** (Futuro)

5. ✅ **ProjectTimeline.tsx** - Timeline de eventos
6. ✅ **ProjectTasks.tsx** - Gerenciamento de tarefas
7. ✅ **ProjectFiles.tsx** - Gerenciamento de arquivos

---

## 🎯 EXEMPLO DE IMPLEMENTAÇÃO

### **useProjects.ts**

```typescript
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, ProjectFormData } from '@/lib/types/projects';

interface UseProjectsOptions {
  clientId?: string;
  status?: string;
  realtime?: boolean;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar projetos
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        let q = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc')
        );

        // Filtros opcionais
        if (options.clientId) {
          q = query(q, where('clientId', '==', options.clientId));
        }
        if (options.status) {
          q = query(q, where('status', '==', options.status));
        }

        if (options.realtime) {
          // Modo realtime
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Project[];
            setProjects(data);
            setLoading(false);
          });
          return unsubscribe;
        } else {
          // Modo snapshot
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Project[];
          setProjects(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [options.clientId, options.status, options.realtime]);

  // Criar projeto
  const createProject = async (data: ProjectFormData): Promise<string> => {
    try {
      const projectData = {
        ...data,
        status: data.status || 'open',
        priority: data.priority || 'medium',
        progress: 0,
        teamMembers: [data.projectManager],
        files: [],
        tasks: [],
        timeline: [],
        proofsCount: 0,
        actualCost: 0,
        startDate: data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);
      return docRef.id;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar projeto');
    }
  };

  // Atualizar projeto
  const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar projeto');
    }
  };

  // Deletar projeto
  const deleteProject = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar projeto');
    }
  };

  // Buscar por ID
  const getProjectById = async (id: string): Promise<Project> => {
    try {
      const docSnap = await getDoc(doc(db, 'projects', id));
      if (!docSnap.exists()) {
        throw new Error('Projeto não encontrado');
      }
      return { id: docSnap.id, ...docSnap.data() } as Project;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao buscar projeto');
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
  };
}
```

---

## 📚 REFERÊNCIAS

- **Documentação completa:** `docs/03-CRM-MODULE.md`
- **Types de referência:** `docs/TYPES-REFERENCE-COMPLETE.md`
- **Exemplos de hooks:** `src/hooks/comercial/useBudgets.ts`
- **Exemplos de listas:** `src/components/comercial/budgets/BudgetsList.tsx`

---

**Última atualização:** 16 de outubro de 2025  
**Status:** ✅ Documentação completa
