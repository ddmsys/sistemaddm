// src/hooks/production/useProjects.ts
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project, ProjectFilters } from "@/lib/types/projects";

export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    // Aplicar filtros
    if (filters?.status?.length) {
      q = query(q, where("status", "in", filters.status));
    }
    if (filters?.priority?.length) {
      q = query(q, where("priority", "in", filters.priority));
    }
    if (filters?.category?.length) {
      q = query(q, where("category", "in", filters.category));
    }
    if (filters?.assignedTo?.length) {
      q = query(
        q,
        where("assignedTo", "array-contains-any", filters.assignedTo)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        let filteredProjects = projectsData;
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredProjects = projectsData.filter(
            (project) =>
              project.title.toLowerCase().includes(searchTerm) ||
              project.catalogCode.toLowerCase().includes(searchTerm) ||
              project.clientName.toLowerCase().includes(searchTerm)
          );
        }

        setProjects(filteredProjects);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [filters]);

  const createProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const now = Timestamp.now();
      const newProject = {
        ...projectData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, "projects"), newProject);
      return docRef.id;
    } catch (err: any) {
      throw new Error(`Erro ao criar projeto: ${err.message}`);
    }
  };

  const updateProject = async (
    projectId: string,
    updates: Partial<Project>
  ) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (err: any) {
      throw new Error(`Erro ao atualizar projeto: ${err.message}`);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await deleteDoc(projectRef);
    } catch (err: any) {
      throw new Error(`Erro ao deletar projeto: ${err.message}`);
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}
