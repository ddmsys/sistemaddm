"use client";

import { ProjectModal } from "@/components/comercial/modals/ProjectModal";
import { useFirestore } from "@/hooks/useFirestore";
import {
  Client,
  Project,
  ProjectFormData,
  ProjectPriority,
  ProjectStatus,
} from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  DollarSign,
  Filter,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";

interface FilterState {
  status: ProjectStatus | "";
  priority: ProjectPriority | "";
  search: string;
}

export default function ProjectsPage() {
  const {
    data: projects,
    loading,
    create,
    update,
    remove,
  } = useFirestore<Project>("projects");
  const { data: clients } = useFirestore<Client>("clients");
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    priority: "",
    search: "",
  });

  // Mock users - substituir por dados reais
  const users = [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Maria Santos" },
    { id: "3", name: "Pedro Costa" },
  ];

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      if (selectedProject) {
        await update(selectedProject.id, {
          ...data,
          start_date: new Date(data.start_date) as any,
          due_date: new Date(data.due_date) as any,
        });
      } else {
        // Encontrar cliente para pegar o nome
        const client = clients.find((c) => c.id === data.client_id);

        await create({
          ...data,
          project_number: `PRJ-${new Date().getFullYear()}-${String(
            Date.now()
          ).slice(-6)}`,
          status: "planning" as ProjectStatus,
          client_name: client?.name || "",
          progress: 0,
          start_date: new Date(data.start_date) as any,
          due_date: new Date(data.due_date) as any,
        });
      }
      setShowModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      throw error;
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await remove(projectId);
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
      }
    }
  };

  const statusOptions = [
    { value: "", label: "Todos os status" },
    { value: "planning", label: "Planejamento" },
    { value: "in_progress", label: "Em Andamento" },
    { value: "review", label: "Em Revisão" },
    { value: "completed", label: "Concluído" },
    { value: "cancelled", label: "Cancelado" },
    { value: "on_hold", label: "Pausado" },
  ];

  const priorityOptions = [
    { value: "", label: "Todas as prioridades" },
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "urgent", label: "Urgente" },
  ];

  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      planning: "bg-gray-50 text-gray-700 border-gray-200",
      in_progress: "bg-blue-50 text-blue-700 border-blue-200",
      review: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      on_hold: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colors[status];
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      planning: "Planejamento",
      in_progress: "Em Andamento",
      review: "Em Revisão",
      completed: "Concluído",
      cancelled: "Cancelado",
      on_hold: "Pausado",
    };
    return labels[status];
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };
    return colors[priority];
  };

  const getPriorityLabel = (priority: ProjectPriority) => {
    const labels = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      urgent: "Urgente",
    };
    return labels[priority];
  };

  const displayProjects = projects.filter((project) => {
    if (filters.status && project.status !== filters.status) return false;
    if (filters.priority && project.priority !== filters.priority) return false;
    if (
      filters.search &&
      !project.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !project.client_name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) &&
      !project.project_number
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const isOverdue = (project: Project) => {
    if (!project.due_date) return false;
    const dueDate = new Date(project.due_date.seconds * 1000);
    return (
      dueDate < new Date() &&
      project.status !== "completed" &&
      project.status !== "cancelled"
    );
  };

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Projetos</h1>
            <p className="text-primary-600 mt-2">
              Gerencie seus projetos em andamento
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedProject(null);
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Projeto
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Buscar projetos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-primary-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Título, número ou cliente..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Status
              </label>
              <select
                className="w-full h-12 px-4 border border-primary-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as ProjectStatus | "",
                  })
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Prioridade
              </label>
              <select
                className="w-full h-12 px-4 border border-primary-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={filters.priority}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priority: e.target.value as ProjectPriority | "",
                  })
                }
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="flex items-center px-4 py-3 text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">
                {loading
                  ? "Carregando..."
                  : `${displayProjects.length} projetos encontrados`}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-primary-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>
                    Em andamento:{" "}
                    {projects.filter((p) => p.status === "in_progress").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  <span>Total: {projects.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-primary-600">
                  Carregando projetos...
                </span>
              </div>
            ) : displayProjects.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-primary-600 mb-6">
                  Comece criando seu primeiro projeto.
                </p>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setShowModal(true);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Criar Primeiro Projeto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-lg border p-6 hover:shadow-md transition-all relative ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {isOverdue(project) && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary-900 leading-tight">
                            {project.title}
                          </h3>
                          <p className="text-xs text-primary-500">
                            {project.project_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full border">
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-primary-600">
                        <User className="w-4 h-4 mr-2" />
                        <span className="truncate">{project.client_name}</span>
                      </div>
                      <div className="flex items-center text-sm text-primary-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Entrega:{" "}
                          {formatDate(
                            new Date(project.due_date.seconds * 1000)
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-primary-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>Orçamento: {formatCurrency(project.budget)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <span className="text-primary-600">Prioridade: </span>
                        <span
                          className={`font-medium ${getPriorityColor(
                            project.priority
                          )}`}
                        >
                          {getPriorityLabel(project.priority)}
                        </span>
                      </div>
                      <div className="text-sm text-primary-600">
                        <span className="font-medium">
                          {project.progress || 0}%
                        </span>{" "}
                        concluído
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-primary-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                      <div className="text-xs text-primary-500">
                        {project.created_at &&
                          formatDate(
                            new Date(project.created_at.seconds * 1000)
                          )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <ProjectModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleCreateProject}
          project={selectedProject}
          clients={clients}
          users={users}
        />
      </div>
    </div>
  );
}
