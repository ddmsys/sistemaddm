//src/app/(authenticated/crm/projects/[id]/page.tsx//
"use client";

import { ProjectModal } from "@/components/comercial/modals/ProjectModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProjects } from "@/hooks/comercial/useProjects";
import { Project } from "@/lib/types/comercial";
import { PRODUCT_TYPE_LABELS } from "@/lib/types/shared";
import { formatDate } from "@/lib/utils/formatters";
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Timestamp } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProject, updateProjectStatus } = useProjects();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectId = params?.id as string | undefined;

  // ================ LOAD PROJECT ================
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;

      setLoading(true);
      try {
        const projectData = await getProject(projectId);
        if (projectData) {
          setProject(projectData);
        } else {
          toast.error("Projeto não encontrado");
          router.push("/crm/projects");
        }
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        toast.error("Erro ao carregar projeto");
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [projectId, getProject, router]);

  // ================ HANDLERS ================
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: Project["status"]) => {
    if (!project) return;

    const success = await updateProjectStatus(project.id ?? "", newStatus);
    if (success) {
      // Recarregar dados
      const updatedProject = await getProject(project.id ?? "");
      if (updatedProject) {
        setProject(updatedProject);
      }
    }
  };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // ================ UTILS ================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 h-8 w-64 rounded animate-pulse" />
        <div className="bg-gray-200 h-64 rounded-lg animate-pulse" />
        <div className="bg-gray-200 h-96 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erro: ID do projeto não encontrado</p>
        <Button onClick={() => router.push("/crm/projects")} className="mt-4">
          Voltar para projetos
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Projeto não encontrado</p>
        <Button onClick={() => router.push("/crm/projects")} className="mt-4">
          Voltar para projetos
        </Button>
      </div>
    );
  }

  const isOverdue = project.dueDate
    ? project.dueDate.toDate() < new Date() &&
      !["done", "cancelled", "shipped"].includes(project.status)
    : false;

  return (
    <div className="space-y-6">
      {/* ================ HEADER ================ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/crm/projects")}
            leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Voltar
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.title}
            </h1>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-sm text-gray-600 font-mono">
                {project.catalogCode || "Código em processamento..."}
              </p>
              <span className="text-gray-400">•</span>
              <p className="text-sm text-gray-600">
                {PRODUCT_TYPE_LABELS[project.category]} ({project.category})
              </p>
              <Badge variant="default">{project.status}</Badge>
              <Badge variant="outline">{project.priority}</Badge>
              {isOverdue && (
                <span className="text-sm text-red-600 font-medium">
                  (Atrasado)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleEdit}
            leftIcon={<PencilIcon className="w-4 h-4" />}
          >
            Editar
          </Button>
        </div>
      </div>

      {/* ================ QUICK ACTIONS ================ */}
      <Card className="border shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Ações Rápidas</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={project.status === "design" ? "default" : "outline"}
              onClick={() => void handleStatusUpdate("design")}
              disabled={project.status === "design"}
            >
              Iniciar Design
            </Button>

            <Button
              size="sm"
              variant={project.status === "review" ? "default" : "outline"}
              onClick={() => void handleStatusUpdate("review")}
              disabled={project.status === "review"}
            >
              Enviar para Revisão
            </Button>

            <Button
              size="sm"
              variant={project.status === "production" ? "default" : "outline"}
              onClick={() => void handleStatusUpdate("production")}
              disabled={project.status === "production"}
            >
              Iniciar Produção
            </Button>

            <Button
              size="sm"
              variant={project.status === "done" ? "default" : "outline"}
              onClick={() => void handleStatusUpdate("done")}
              disabled={project.status === "done"}
            >
              Marcar como Concluído
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================ INFORMAÇÕES PRINCIPAIS ================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Informações do Projeto</h3>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {project.clientName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <Badge variant="default">{project.status}</Badge>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Prioridade
                </dt>
                <dd className="mt-1">
                  <Badge variant="outline">{project.priority}</Badge>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Tipo de Produto
                </dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {PRODUCT_TYPE_LABELS[project.category]} ({project.category})
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Prazo de Entrega
                </dt>
                <dd
                  className={`text-sm mt-1 ${
                    isOverdue ? "text-red-600 font-medium" : "text-gray-900"
                  }`}
                >
                  {project.dueDate
                    ? formatDate(project.dueDate)
                    : "Não definido"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {formatDate(project.createdAt)}
                </dd>
              </div>

              {project.assignedTo && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Responsável
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {project.assignedTo}
                  </dd>
                </div>
              )}

              {project.quoteId && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Orçamento Vinculado
                  </dt>
                  <dd className="text-sm text-blue-600 mt-1">
                    <button
                      onClick={() =>
                        router.push(`/crm/quotes/${project.quoteId}`)
                      }
                      className="hover:underline"
                    >
                      Ver orçamento →
                    </button>
                  </dd>
                </div>
              )}

              {project.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Descrição
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {project.description}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* ================ RESUMO DO PROJETO ================ */}
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Resumo</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Orçamento</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(project.budget)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Dias até o prazo</p>
                  <p
                    className={`text-lg font-semibold ${
                      isOverdue ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {project.dueDate
                      ? Math.ceil(
                          (project.dueDate.toDate().getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DocumentCheckIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Provas Enviadas</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {project.proofsCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Aprovações Pendentes</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {project.clientApprovalTasks?.filter(
                      (task: { status: string }) => task.status === "pending"
                    ).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================ TAREFAS DE APROVAÇÃO ================ */}
      {project.clientApprovalTasks &&
        project.clientApprovalTasks.length > 0 && (
          <Card className="border shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Tarefas de Aprovação do Cliente
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.clientApprovalTasks?.map(
                  (
                    task: {
                      id?: string;
                      description: string;
                      dueDate: Timestamp | Date | string | null | undefined;
                      notes?: string;
                      status: "pending" | "approved" | "rejected";
                    },
                    index: number
                  ) => (
                    <div
                      key={task.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {task.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Prazo: {formatDate(task.dueDate)}
                        </p>
                        {task.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {task.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : task.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {task.status === "pending"
                            ? "Pendente"
                            : task.status === "approved"
                            ? "Aprovado"
                            : "Rejeitado"}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* ================ OBSERVAÇÕES ================ */}
      {project.notes && (
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Observações</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {project.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ================ MODAL ================ */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        onSave={async (updatedData) => {
          try {
            // TODO: implementar salvamento real
            console.log("Salvando projeto:", updatedData);
            setIsModalOpen(false);
            // Recarregar projeto após salvar
            if (project?.id) {
              const refreshedProject = await getProject(project.id);
              if (refreshedProject) {
                setProject(refreshedProject);
              }
            }
          } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error("Erro ao salvar projeto");
          }
        }}
      />
    </div>
  );
}
