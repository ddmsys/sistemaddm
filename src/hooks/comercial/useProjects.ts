// src/hooks/useProjects.ts
'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { Project, ProjectFilters, ProjectFormData, ProjectStatus } from '@/lib/types/projects'; // Corrigido import
import { AsyncState } from '@/lib/types/shared';

function isError(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<AsyncState<Project[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchProjects = useCallback(
    async (filters?: ProjectFilters) => {
      if (!user) return;

      setProjects((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

        if (filters?.status?.length) {
          projectsQuery = query(projectsQuery, where('status', 'in', filters.status));
        }

        if (filters?.priority?.length) {
          projectsQuery = query(projectsQuery, where('priority', 'in', filters.priority));
        }

        if (filters?.assignedTo?.length) {
          projectsQuery = query(projectsQuery, where('assignedTo', 'in', filters.assignedTo));
        }

        const snapshot = await getDocs(projectsQuery);
        let projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          projectsData = projectsData.filter((project) => {
            const createdAt =
              project.createdAt instanceof Timestamp
                ? project.createdAt.toDate()
                : new Date(project.createdAt);
            const start = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
            const end = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          projectsData = projectsData.filter(
            (project) =>
              project.title?.toLowerCase().includes(searchLower) ||
              project.catalogCode?.toLowerCase().includes(searchLower) ||
              project.clientName?.toLowerCase().includes(searchLower),
          );
        }

        setProjects({
          data: projectsData,
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        const errorMessage = isError(error) ? error.message : 'Erro ao carregar projetos';
        console.error('Erro ao buscar projetos:', errorMessage);
        setProjects({
          data: null,
          loading: false,
          error: errorMessage,
        });
        toast.error(errorMessage);
      }
    },
    [user],
  );

  const createProject = useCallback(
    async (data: ProjectFormData): Promise<string | null> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return null;
      }

      // Validação crítica
      if (!data.product) {
        toast.error('Tipo do produto é obrigatório');
        return null;
      }

      if (!data.projectManager) {
        toast.error('Gerente do projeto é obrigatório');
        return null;
      }

      try {
        // Criar objeto Project com TODOS os campos obrigatórios
        const projectData: Omit<Project, 'id'> = {
          // Relacionamentos
          clientId: data.clientId,
          clientName: data.clientName || '',
          quoteId: data.quoteId || undefined,

          // Dados básicos OBRIGATÓRIOS
          title: data.title,
          description: data.description || '',
          product: data.product, // Corrigido de category para product
          status: data.status || 'open',
          priority: data.priority || 'medium',

          // Datas OBRIGATÓRIAS
          startDate: data.startDate
            ? Timestamp.fromDate(new Date(data.startDate))
            : Timestamp.now(),
          dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined,

          // Campos OBRIGATÓRIOS para gestão
          progress: 0, // Sempre começa com 0
          teamMembers: [], // Array vazio inicialmente
          projectManager: data.projectManager, // OBRIGATÓRIO
          actualCost: 0, // Sempre começa com 0

          // Arrays OBRIGATÓRIOS (vazios inicialmente)
          files: [],
          tasks: [],
          timeline: [],

          // Campos OBRIGATÓRIOS de gestão
          proofsCount: 0,

          // Campos opcionais
          budget: data.budget || 0,
          assignedTo: data.assignedTo || '',
          clientApprovalTasks: [],
          tags: [],
          notes: data.notes || '',
          createdBy: user.uid,

          // Timestamps OBRIGATÓRIOS
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        console.log('💾 Salvando projeto:', projectData);
        const docRef = await addDoc(collection(db, 'projects'), projectData);

        toast.success('Projeto criado com sucesso!');
        await fetchProjects();

        return docRef.id;
      } catch (error: unknown) {
        console.error('❌ ERRO AO CRIAR PROJETO:', error);
        const errorMessage = isError(error) ? error.message : 'Erro ao criar projeto';
        toast.error(errorMessage);
        return null;
      }
    },
    [user, fetchProjects],
  );

  const updateProject = useCallback(
    async (id: string, data: Partial<Project>): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const docRef = doc(db, 'projects', id);
        const updateData: Partial<Project> & { updatedAt: Timestamp } = {
          ...data,
          updatedAt: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);
        toast.success('Projeto atualizado com sucesso!');
        await fetchProjects();

        return true;
      } catch (error: unknown) {
        const errorMessage = isError(error) ? error.message : 'Erro ao atualizar projeto';
        console.error(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [user, fetchProjects],
  );

  const updateProjectStatus = useCallback(
    async (id: string, status: ProjectStatus): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const docRef = doc(db, 'projects', id);
        await updateDoc(docRef, {
          status,
          updatedAt: Timestamp.now(),
        });

        toast.success('Status do projeto atualizado!');
        await fetchProjects();

        return true;
      } catch (error: unknown) {
        const errorMessage = isError(error) ? error.message : 'Erro ao atualizar status';
        console.error(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [user, fetchProjects],
  );

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await deleteDoc(doc(db, 'projects', id));
        toast.success('Projeto excluído com sucesso!');
        await fetchProjects();

        return true;
      } catch (error: unknown) {
        const errorMessage = isError(error) ? error.message : 'Erro ao excluir projeto';
        console.error(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [user, fetchProjects],
  );

  // ================ GET SINGLE PROJECT ================
  const getProject = useCallback(
    async (projectId: string): Promise<Project | null> => {
      if (!user || !projectId) return null;

      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          return {
            id: projectDoc.id,
            ...projectDoc.data(),
          } as Project;
        }
        return null;
      } catch (error) {
        console.error('Erro ao buscar projeto:', error);
        return null;
      }
    },
    [user],
  );

  const getProjectsByQuote = useCallback(async (quoteId: string): Promise<Project[]> => {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('quoteId', '==', quoteId),
        orderBy('createdAt', 'desc'),
      );

      const snapshot = await getDocs(projectsQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
    } catch (error: unknown) {
      const errorMessage = isError(error) ? error.message : 'Erro ao buscar projetos do orçamento';
      console.error(errorMessage);
      return [];
    }
  }, []);

  const getProjectsByClient = useCallback(async (clientId: string): Promise<Project[]> => {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc'),
      );

      const snapshot = await getDocs(projectsQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
    } catch (error: unknown) {
      const errorMessage = isError(error) ? error.message : 'Erro ao buscar projetos do cliente';
      console.error(errorMessage);
      return [];
    }
  }, []);

  useEffect(() => {
    if (user) {
      void fetchProjects();
    }
  }, [user, fetchProjects]);

  return {
    projects: projects.data || [],
    loading: projects.loading,
    error: projects.error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    getProjectsByQuote,
    getProjectsByClient,
    refetch: fetchProjects,
  };
}
