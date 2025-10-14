// src/hooks/production/useProductionProjects.ts

// Hook para gerenciamento de projetos de produção

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
  calculateProgress,
  createProjectFromOrder,
  generateProjectNumber,
  ProductionProject,
  ProductionProjectFormData,
  ProductionProjectStatus,
  ProjectStage,
  ProjectStageType,
  ProjectUpdate,
  StageFormData,
  StageStatus,
  StageUpdateData,
  validateProductionProject,
  validateStage,
} from '@/lib/types/production-projects';
import { getUserDisplayName, getUserId } from '@/lib/utils/user-helper';

// ==================== INTERFACES ====================
interface UseProductionProjectsOptions {
  clientId?: string;
  orderId?: string;
  status?: ProductionProjectStatus;
  realtime?: boolean;
}

interface UseProductionProjectsReturn {
  projects: ProductionProject[];
  loading: boolean;
  error: string | null;
  createProjectFromOrderId: (orderId: string) => Promise<string>;
  createCustomProject: (data: ProductionProjectFormData) => Promise<string>;
  updateProject: (id: string, data: Partial<ProductionProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addStage: (projectId: string, stage: StageFormData) => Promise<void>;
  updateStage: (projectId: string, stageId: string, data: StageUpdateData) => Promise<void>;
  deleteStage: (projectId: string, stageId: string) => Promise<void>;
  addUpdate: (
    projectId: string,
    update: Omit<ProjectUpdate, 'id' | 'date' | 'userId' | 'userName'>,
  ) => Promise<void>;
  getProjectById: (id: string) => Promise<ProductionProject | null>;
}

// ==================== HOOK ====================
export function useProductionProjects(
  options: UseProductionProjectsOptions = {},
): UseProductionProjectsReturn {
  const { clientId, orderId, status, realtime = true } = options;
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProductionProject[]>([]);
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
      const projectsRef = collection(db, 'production_projects');
      const constraints: QueryConstraint[] = [];

      if (clientId) {
        constraints.push(where('clientId', '==', clientId));
      }

      if (orderId) {
        constraints.push(where('orderId', '==', orderId));
      }

      if (status) {
        constraints.push(where('status', '==', status));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(projectsRef, ...constraints);

      if (realtime) {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const projectsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as ProductionProject[];

            setProjects(projectsData);
            setLoading(false);
          },
          (err) => {
            console.error('Error loading production projects:', err);
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
            })) as ProductionProject[];

            setProjects(projectsData);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error loading production projects:', err);
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error setting up production projects query:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [user, clientId, orderId, status, realtime]);

  // ===== GET NEXT PROJECT NUMBER =====
  const getNextProjectNumber = async (): Promise<string> => {
    try {
      const year = new Date().getFullYear();
      const projectsRef = collection(db, 'production_projects');
      const q = query(
        projectsRef,
        where('number', '>=', `PROD-${year}-000`),
        where('number', '<=', `PROD-${year}-999`),
        orderBy('number', 'desc'),
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return generateProjectNumber(year, 1);
      }

      const lastNumber = snapshot.docs[0].data().number as string;
      const lastSequential = parseInt(lastNumber.split('-')[2], 10);
      return generateProjectNumber(year, lastSequential + 1);
    } catch (err) {
      console.error('Error getting next project number:', err);
      throw err;
    }
  };

  // ===== CREATE PROJECT FROM ORDER =====
  const createProjectFromOrderId = async (orderId: string): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));

      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }

      const orderData = orderDoc.data();

      // Verificar status conforme enum
      if (orderData.status !== 'confirmed' && orderData.status !== 'in_production') {
        throw new Error('Order must be confirmed to create production project');
      }

      const projectNumber = await getNextProjectNumber();
      const userId = getUserId(user);

      const projectData = createProjectFromOrder(
        orderId,
        orderData.clientId,
        orderData.bookId,
        orderData.bookData?.title || 'Untitled',
      );

      const now = Timestamp.now();
      const completeProjectData: Omit<ProductionProject, 'id'> = {
        ...projectData,
        number: projectNumber,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      };

      const projectsRef = collection(db, 'production_projects');
      const docRef = await addDoc(projectsRef, completeProjectData);

      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating project from order:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== CREATE CUSTOM PROJECT =====
  const createCustomProject = async (data: ProductionProjectFormData): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const validationErrors = validateProductionProject(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      const projectNumber = await getNextProjectNumber();

      const processedStages: ProjectStage[] = data.stages.map((stage) => {
        const toTimestamp = (value: any): Timestamp | undefined => {
          if (!value) return undefined;
          if (value instanceof Timestamp) return value;
          if (value instanceof Date) return Timestamp.fromDate(value);
          if (value.seconds !== undefined) return value as Timestamp;
          return undefined;
        };

        return {
          id: `stage_${Date.now()}_${Math.random()}`,
          name: stage.name,
          type: stage.type || ProjectStageType.OTHER,
          description: stage.description,
          status: StageStatus.PENDING,
          assigneeId: stage.assigneeId,
          startDate: toTimestamp(stage.startDate),
          dueDate: toTimestamp(stage.dueDate),
          files: stage.files || [],
          notes: stage.notes,
        };
      });

      const progress = calculateProgress(processedStages);
      const userId = getUserId(user);

      const now = Timestamp.now();

      // ✅ CORRIGIDO: Usar campos corretos do ProductionProjectFormData
      const projectData: Omit<ProductionProject, 'id'> = {
        number: projectNumber,
        title: data.title,
        description: data.description,
        clientId: data.clientId, // ✅ CORRIGIDO
        bookId: data.bookId, // ✅ CORRIGIDO
        orderId: data.orderId,
        status: ProductionProjectStatus.NOT_STARTED,
        stages: processedStages,
        progress,
        updates: [],
        startDate: data.plannedStartDate ? Timestamp.fromDate(data.plannedStartDate) : undefined,
        estimatedCompletionDate: data.estimatedCompletionDate
          ? Timestamp.fromDate(data.estimatedCompletionDate)
          : undefined,
        notes: data.notes,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      };

      const projectsRef = collection(db, 'production_projects');
      const docRef = await addDoc(projectsRef, projectData);

      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating custom project:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE PROJECT =====
  const updateProject = async (id: string, data: Partial<ProductionProject>): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const userId = getUserId(user);

      const updateData: Record<string, any> = {
        ...data,
        updatedAt: Timestamp.now(),
        updatedBy: userId,
      };

      if (data.stages) {
        updateData.progress = calculateProgress(data.stages);
      }

      const projectRef = doc(db, 'production_projects', id);
      await updateDoc(projectRef, updateData);
    } catch (err) {
      const error = err as Error;
      console.error('Error updating project:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== DELETE PROJECT =====
  const deleteProject = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const projectRef = doc(db, 'production_projects', id);
      await deleteDoc(projectRef);
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting project:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== ADD STAGE =====
  const addStage = async (projectId: string, stageData: StageFormData): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const validationError = validateStage(stageData);
      if (validationError) {
        throw new Error(`Validation error: ${validationError}`);
      }

      const projectRef = doc(db, 'production_projects', projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const project = projectDoc.data() as ProductionProject;
      const userId = getUserId(user);

      const newStage: ProjectStage = {
        id: `stage_${Date.now()}`,
        name: stageData.name,
        type: stageData.type || ProjectStageType.OTHER,
        description: stageData.description,
        status: StageStatus.PENDING,
        assigneeId: stageData.assigneeId,
        startDate: stageData.startDate ? Timestamp.fromDate(stageData.startDate) : undefined,
        dueDate: stageData.dueDate ? Timestamp.fromDate(stageData.dueDate) : undefined,
        files: stageData.files
          ? stageData.files.map((file) => ({
              name: file.name,
              url: file.url,
              uploadedAt: Timestamp.now(),
              uploadedBy: userId,
            }))
          : [],
        notes: stageData.notes,
        orderItemId: stageData.orderItemId,
      };

      const updatedStages = [...project.stages, newStage];
      const progress = calculateProgress(updatedStages);

      await updateDoc(projectRef, {
        stages: updatedStages,
        progress,
        updatedAt: Timestamp.now(),
        updatedBy: userId,
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error adding stage:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== UPDATE STAGE =====
  const updateStage = async (
    projectId: string,
    stageId: string,
    data: StageUpdateData,
  ): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const projectRef = doc(db, 'production_projects', projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const project = projectDoc.data() as ProductionProject;

      const updatedStages = project.stages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              ...data,
              completionDate:
                data.status === StageStatus.COMPLETED ? Timestamp.now() : stage.completionDate,
            }
          : stage,
      );

      const progress = calculateProgress(updatedStages);

      let projectStatus = project.status;
      if (updatedStages.every((s) => s.status === StageStatus.COMPLETED)) {
        projectStatus = ProductionProjectStatus.COMPLETED;
      } else if (updatedStages.some((s) => s.status === StageStatus.IN_PROGRESS)) {
        projectStatus = ProductionProjectStatus.IN_PROGRESS;
      }

      const userId = getUserId(user);

      await updateDoc(projectRef, {
        stages: updatedStages,
        progress,
        status: projectStatus,
        updatedAt: Timestamp.now(),
        updatedBy: userId,
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error updating stage:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== DELETE STAGE =====
  const deleteStage = async (projectId: string, stageId: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const projectRef = doc(db, 'production_projects', projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const project = projectDoc.data() as ProductionProject;

      const updatedStages = project.stages.filter((stage) => stage.id !== stageId);
      const progress = calculateProgress(updatedStages);
      const userId = getUserId(user);

      await updateDoc(projectRef, {
        stages: updatedStages,
        progress,
        updatedAt: Timestamp.now(),
        updatedBy: userId,
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting stage:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== ADD UPDATE =====
  const addUpdate = async (
    projectId: string,
    updateData: Omit<ProjectUpdate, 'id' | 'date' | 'userId' | 'userName'>,
  ): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const projectRef = doc(db, 'production_projects', projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const project = projectDoc.data() as ProductionProject;

      const userId = getUserId(user);
      const userName = getUserDisplayName(user);

      const newUpdate: ProjectUpdate = {
        id: `update_${Date.now()}`,
        ...updateData,
        userId: userId,
        userName: userName,
        date: Timestamp.now(),
      };

      const updatedUpdates = [...(project.updates || []), newUpdate];

      await updateDoc(projectRef, {
        updates: updatedUpdates,
        updatedAt: Timestamp.now(),
        updatedBy: userId,
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error adding update:', error);
      setError(error.message);
      throw error;
    }
  };

  // ===== GET PROJECT BY ID =====
  const getProjectById = async (id: string): Promise<ProductionProject | null> => {
    try {
      const projectDoc = await getDoc(doc(db, 'production_projects', id));

      if (!projectDoc.exists()) {
        return null;
      }

      return {
        id: projectDoc.id,
        ...projectDoc.data(),
      } as ProductionProject;
    } catch (err) {
      const error = err as Error;
      console.error('Error getting project:', error);
      throw error;
    }
  };

  return {
    projects,
    loading,
    error,
    createProjectFromOrderId,
    createCustomProject,
    updateProject,
    deleteProject,
    addStage,
    updateStage,
    deleteStage,
    addUpdate,
    getProjectById,
  };
}
