// src/hooks/comercial/useProjects.ts

// Hook para gerenciamento de projetos CRM

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
import type {
  ProductType,
  Project,
  ProjectFormData,
  ProjectPriority,
  ProjectStatus,
} from "@/lib/types/projects";
import { getUserId } from "@/lib/utils/user-helper";

// ==================== TYPES ====================

// Import dos types do projeto

// ==================== INTERFACES ====================

interface UseProjectsOptions {
  clientId?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  product?: ProductType;
  realtime?: boolean;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (data: ProjectFormData) => Promise<string>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Promise<Project | null>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<void>;
  updateProjectProgress: (id: string, progress: number) => Promise<void>;
}

// ==================== VALIDATION ====================

function validateProject(data: ProjectFormData): string[] {
  const errors: string[] = [];

  // Campos obrigatórios básicos
  if (!data.title?.trim()) {
    errors.push("Título é obrigatório");
  }

  if (!data.clientId?.trim()) {
    errors.push("Cliente é obrigatório");
  }

  if (!data.product) {
    errors.push("Tipo de produto é obrigatório");
  }

  if (!data.priority) {
    errors.push("Prioridade é obrigatória");
  }

  if (!data.projectManager?.trim()) {
    errors.push("Gerente de projeto é obrigatório");
  }

  // Validar datas
  if (data.startDate) {
    const startDate = new Date(data.startDate);
    if (isNaN(startDate.getTime())) {
      errors.push("Data de início inválida");
    }
  }

  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push("Data de entrega inválida");
    }

    if (data.startDate) {
      const startDate = new Date(data.startDate);
      if (dueDate < startDate) {
        errors.push("Data de entrega deve ser posterior à data de início");
      }
    }
  }

  // Validar budget
  if (data.budget !== undefined && data.budget < 0) {
    errors.push("Budget não pode ser negativo");
  }

  return errors;
}

// ==================== HOOK ====================

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { clientId, status, priority, product, realtime = true } = options;
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== LOAD PROJECTS =====
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const projectsRef = collection(db, "projects");
      const constraints: QueryConstraint[] = [];

      // ✅ Filtros flexíveis
      if (clientId) {
        constraints.push(where("clientId", "==", clientId));
      }

      if (status) {
        constraints.push(where("status", "==", status));
      }

      if (priority) {
        constraints.push(where("priority", "==", priority));
      }

      if (product) {
        constraints.push(where("product", "==", product));
      }

      constraints.push(orderBy("createdAt", "desc"));

      const q = query(projectsRef, ...constraints);

      if (realtime) {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const projectsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Project[];

            setProjects(projectsData);
            setLoading(false);
          },
          (err) => {
            console.error("Error loading projects:", err);
            setError(err.message);
            setLoading(false);
          },
        );

        return () => unsubscribe();
      } else {
        getDocs(q)
          .then((snapshot) => {
            const projectsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Project[];

            setProjects(projectsData);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error loading projects:", err);
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error setting up projects query:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [user, clientId, status, priority, product, realtime]);

  // ===== CREATE PROJECT =====
  const createProject = async (data: ProjectFormData): Promise<string> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      // ✅ Validação inteligente
      const validationErrors = validateProject(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(", ")}`);
      }

      const userId = getUserId(user);
      const now = Timestamp.now();

      // ✅ Processar datas
      const startDate = data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : now;

      const dueDate = data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined;

      // ✅ Criar projeto com todos os campos obrigatórios
      const projectData: Omit<Project, "id"> = {
        // Identificação (será gerado pela Cloud Function)
        catalogCode: undefined,

        // Relacionamentos OBRIGATÓRIOS
        clientId: data.clientId,
        clientName: data.clientName,
        budgetId: data.budgetId,

        // Dados básicos OBRIGATÓRIOS
        title: data.title,
        description: data.description,
        product: data.product,
        status: data.status || "open",
        priority: data.priority || "medium",

        // Datas OBRIGATÓRIAS
        startDate: startDate,
        dueDate: dueDate,
        completionDate: undefined,

        // Gestão OBRIGATÓRIA
        progress: 0,
        teamMembers: [data.projectManager],
        projectManager: data.projectManager,
        actualCost: 0,

        // Arrays OBRIGATÓRIOS (inicializar vazios)
        files: [],
        tasks: [],
        timeline: [],
        proofsCount: 0,

        // Opcionais
        specifications: data.specifications,
        invoiceId: undefined,
        budget: data.budget,
        assignedTo: data.assignedTo,
        clientApprovalTasks: [],
        tags: [],
        notes: data.notes,
        createdBy: userId,

        createdAt: now,
        updatedAt: now,
      };

      const projectsRef = collection(db, "projects");
      const docRef = await addDoc(projectsRef, projectData);

      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error("Error creating project:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE PROJECT =====
  const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      // Converter datas se necessário
      if (data.startDate && !(data.startDate instanceof Timestamp)) {
        updateData.startDate = Timestamp.fromDate(new Date(data.startDate));
      }

      if (data.dueDate && !(data.dueDate instanceof Timestamp)) {
        updateData.dueDate = Timestamp.fromDate(new Date(data.dueDate));
      }

      if (data.completionDate && !(data.completionDate instanceof Timestamp)) {
        updateData.completionDate = Timestamp.fromDate(new Date(data.completionDate));
      }

      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating project:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== DELETE PROJECT =====
  const deleteProject = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const projectRef = doc(db, "projects", id);
      await deleteDoc(projectRef);
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting project:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== GET PROJECT BY ID =====
  const getProjectById = async (id: string): Promise<Project | null> => {
    try {
      const projectDoc = await getDoc(doc(db, "projects", id));

      if (!projectDoc.exists()) {
        return null;
      }

      return {
        id: projectDoc.id,
        ...projectDoc.data(),
      } as Project;
    } catch (err) {
      const error = err as Error;
      console.error("Error getting project:", error);
      throw error;
    }
  };

  // ===== UPDATE PROJECT STATUS =====
  const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const updateData: Record<string, unknown> = {
        status,
        updatedAt: Timestamp.now(),
      };

      // Se marcando como concluído, adicionar data de conclusão
      if (status === "done") {
        updateData.completionDate = Timestamp.now();
        updateData.progress = 100;
      }

      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating project status:", error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE PROJECT PROGRESS =====
  const updateProjectProgress = async (id: string, progress: number): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      // Validar progresso
      if (progress < 0 || progress > 100) {
        throw new Error("Progresso deve estar entre 0 e 100");
      }

      const updateData: Record<string, unknown> = {
        progress,
        updatedAt: Timestamp.now(),
      };

      // Se progresso = 100 e status não for 'done', atualizar status
      if (progress === 100) {
        const projectDoc = await getDoc(doc(db, "projects", id));
        if (projectDoc.exists()) {
          const project = projectDoc.data() as Project;
          if (project.status !== "done" && project.status !== "cancelled") {
            updateData.status = "done";
            updateData.completionDate = Timestamp.now();
          }
        }
      }

      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating project progress:", error);
      setError(error.message);
      throw error;
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
    updateProjectStatus,
    updateProjectProgress,
  };
}
