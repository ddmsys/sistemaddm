"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProjectModal } from "@/components/comercial/modals/ProjectModal";
import { useProjects } from "@/hooks/comercial/useProjects";
import { Project } from "@/lib/types/comercial";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  Calendar,
  DollarSign,
} from "lucide-react";

// ✅ FUNÇÃO HELPER PARA FORMATAR DATAS
const formatDate = (dateValue: any): string => {
  if (!dateValue) return "Sem data";

  try {
    // Se for Timestamp do Firestore
    if (dateValue && typeof dateValue === "object" && "toMillis" in dateValue) {
      return new Date(dateValue.toMillis()).toLocaleDateString("pt-BR");
    }

    // Se for Timestamp com seconds
    if (dateValue && typeof dateValue === "object" && "seconds" in dateValue) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString("pt-BR");
    }

    // Se for Date ou string
    return new Date(dateValue).toLocaleDateString("pt-BR");
  } catch (error) {
    console.warn("Erro ao formatar data:", dateValue, error);
    return "Data inválida";
  }
};

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const { projects, createProject, updateProject, deleteProject } =
    useProjects();

  // ✅ FILTRAR PROJETOS
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) ||
        (project.description &&
          project.description.toLowerCase().includes(searchLower)) ||
        (project.number &&
          project.number.toLowerCase().includes(searchLower)) ||
        (project.clientId &&
          project.clientId.toLowerCase().includes(searchLower))
      );
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  const handleSave = async (
    projectData: Omit<Project, "id" | "number" | "createdAt" | "updatedAt">
  ): Promise<void> => {
    setLoading(true);
    try {
      if (selectedProject?.id) {
        await updateProject(selectedProject.id, projectData);
      } else {
        await createProject(projectData);
      }
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    if (confirm("Tem certeza que deseja deletar este projeto?")) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error("Erro ao deletar projeto:", error);
      }
    }
  };

  const getStatusBadge = (status: Project["status"]) => {
    const variants = {
      open: "bg-blue-100 text-blue-800",
      design: "bg-purple-100 text-purple-800",
      review: "bg-yellow-100 text-yellow-800",
      production: "bg-orange-100 text-orange-800",
      shipped: "bg-green-100 text-green-800",
      done: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const labels = {
      open: "Aberto",
      design: "Design",
      review: "Revisão",
      production: "Produção",
      shipped: "Enviado",
      done: "Concluído",
      cancelled: "Cancelado",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: Project["priority"]) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };

    const labels = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      urgent: "Urgente",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[priority]}`}
      >
        {labels[priority]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projetos</h1>
          <p className="text-slate-600">Gerencie seus projetos em andamento</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-slate-600 mb-4">
              {searchTerm
                ? "Tente uma busca diferente"
                : "Comece criando seu primeiro projeto"}
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Projeto
            </Button>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          #{project.number || "N/A"}
                        </p>
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(project.status)}
                    {getPriorityBadge(project.priority)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign size={14} />
                    <div>
                      <p className="font-medium">Orçamento</p>
                      <p>R$ {(project.budget || 0).toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} />
                    <div>
                      <p className="font-medium">Entrega</p>
                      <p>{formatDate(project.dueDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  <p>
                    <span className="font-medium">Responsável:</span>{" "}
                    {project.assignedToName || "Não atribuído"}
                  </p>
                  <p>
                    <span className="font-medium">Cliente:</span>{" "}
                    {project.clientId || "N/A"}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(project.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
}
