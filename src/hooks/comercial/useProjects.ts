"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/lib/types/comercial";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ BUSCAR PROJETOS EM TEMPO REAL
  useEffect(() => {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData: Project[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          projectsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Project);
        });
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar projetos:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ✅ CRIAR PROJETO
  const createProject = async (
    projectData: Partial<Project>
  ): Promise<string> => {
    try {
      const dataToSave = {
        ...projectData,
        number: await generateProjectNumber(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "projects"), dataToSave);
      console.log("Projeto criado com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      throw error;
    }
  };

  // ✅ ATUALIZAR PROJETO
  const updateProject = async (
    id: string,
    projectData: Partial<Project>
  ): Promise<void> => {
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp(),
      });
      console.log("Projeto atualizado:", id);
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      throw error;
    }
  };

  // ✅ DELETAR PROJETO
  const deleteProject = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "projects", id));
      console.log("Projeto deletado:", id);
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      throw error;
    }
  };

  // ✅ GERAR NÚMERO SEQUENCIAL DO PROJETO
  const generateProjectNumber = async (): Promise<string> => {
    try {
      const projectsRef = collection(db, "projects");
      const snapshot = await getDocs(projectsRef);
      const nextNumber = snapshot.size + 1;
      return `PRJ-${nextNumber.toString().padStart(3, "0")}`; // PRJ-001, PRJ-002...
    } catch (error) {
      console.error("Erro ao gerar número do projeto:", error);
      return `PRJ-${Date.now()}`; // Fallback
    }
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    generateProjectNumber,
  };
}
