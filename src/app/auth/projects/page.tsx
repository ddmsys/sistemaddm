"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project, ProjectStatus } from "@/lib/types";
import { ProjectKanban } from "@/components/projects/ProjectKanban";
import { ProjectCalendar } from "@/components/projects/ProjectCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewProjectModal } from "@/components/projects/NewProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "calendar">("kanban");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          clientId: data.clientId ?? "",
          clientName: data.clientName ?? "",
          clientNumber: data.clientNumber ?? 0,
          catalogCode: data.catalogCode ?? "",
          title: data.title ?? "",
          productType: data.productType ?? "",
          description: data.description ?? "",
          status: data.status ?? "planejamento",
          dueDate: data.dueDate?.toDate
            ? data.dueDate.toDate()
            : new Date(data.dueDate),
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt),
          clientApprovalTasks:
            data.clientApprovalTasks?.map((task: any) => ({
              ...task,
              createdAt: task.createdAt?.toDate
                ? task.createdAt.toDate()
                : new Date(task.createdAt),
              decidedAt: task.decidedAt?.toDate
                ? task.decidedAt.toDate()
                : task.decidedAt,
            })) || [],
          book: data.book ?? null,
          tasks: data.tasks ?? [],
        };
      });
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProjectStatus = async (
    projectId: string,
    newStatus: ProjectStatus
  ) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Carregando projetos...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {modalOpen && (
        <NewProjectModal
          onClose={() => setModalOpen(false)}
          onCreated={() => setModalOpen(false)}
        />
      )}

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "kanban" | "calendar")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <ProjectKanban
            projects={projects}
            onStatusChange={updateProjectStatus}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ProjectCalendar projects={projects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
