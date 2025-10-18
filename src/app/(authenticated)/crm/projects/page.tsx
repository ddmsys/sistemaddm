'use client';

import { Timestamp } from 'firebase/firestore';
import {
  AlertCircle,
  Briefcase,
  Calendar,
  DollarSign,
  Filter,
  Plus,
  Search,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { ProjectModal } from '@/components/comercial/modals/ProjectModal';
import { useFirestore } from '@/hooks/useFirestore';
import { Client, Project, ProjectFormData, ProjectPriority, ProjectStatus } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface FilterState {
  status: ProjectStatus | '';
  priority: ProjectPriority | '';
  search: string;
}

export default function ProjectsPage() {
  const { data: projects, loading, create, update, remove } = useFirestore<Project>('projects');
  const { data: clients } = useFirestore<Client>('clients');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priority: '',
    search: '',
  });

  // Mock users - substituir por dados reais
  const users = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      if (selectedProject) {
        await update(selectedProject.id, {
          ...data,
          start_date: Timestamp.fromDate(new Date(data.start_date)),
          due_date: Timestamp.fromDate(new Date(data.due_date)),
        });
      } else {
        // Encontrar cliente para pegar o nome
        const client = clients.find((c) => c.id === data.client_id);

        await create({
          ...data,
          project_number: `PRJ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          status: 'planning' as ProjectStatus,
          client_name: client?.name || '',
          progress: 0,
          start_date: Timestamp.fromDate(new Date(data.start_date)),
          due_date: Timestamp.fromDate(new Date(data.due_date)),
        });
      }
      setShowModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      throw error;
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await remove(projectId);
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
      }
    }
  };

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'planning', label: 'Planejamento' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'review', label: 'Em Revisão' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'on_hold', label: 'Pausado' },
  ];

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' },
  ];

  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      planning: 'bg-gray-50 text-gray-700 border-gray-200',
      in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
      review: 'bg-amber-50 text-amber-700 border-amber-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      on_hold: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[status];
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      planning: 'Planejamento',
      in_progress: 'Em Andamento',
      review: 'Em Revisão',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      on_hold: 'Pausado',
    };
    return labels[status];
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority];
  };

  const getPriorityLabel = (priority: ProjectPriority) => {
    const labels = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return labels[priority];
  };

  const displayProjects = projects.filter((project) => {
    if (filters.status && project.status !== filters.status) return false;
    if (filters.priority && project.priority !== filters.priority) return false;
    if (
      filters.search &&
      !project.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !project.client_name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !project.project_number.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const isOverdue = (project: Project) => {
    if (!project.due_date) return false;
    const dueDate = new Date(project.due_date.seconds * 1000);
    return dueDate < new Date() && project.status !== 'completed' && project.status !== 'cancelled';
  };

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Projetos</h1>
            <p className="mt-2 text-primary-600">Gerencie seus projetos em andamento</p>
          </div>

          <button
            onClick={() => {
              setSelectedProject(null);
              setShowModal(true);
            }}
            className="mt-4 flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 sm:mt-0"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Projeto
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-primary-700">
                Buscar projetos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-primary-400" />
                <input
                  type="text"
                  className="h-12 w-full rounded-lg border border-primary-200 pl-10 pr-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Título, número ou cliente..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="mb-2 block text-sm font-medium text-primary-700">Status</label>
              <select
                className="h-12 w-full rounded-lg border border-primary-200 px-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as ProjectStatus | '',
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
              <label className="mb-2 block text-sm font-medium text-primary-700">Prioridade</label>
              <select
                className="h-12 w-full rounded-lg border border-primary-200 px-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={filters.priority}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priority: e.target.value as ProjectPriority | '',
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

            <button className="flex items-center rounded-lg border border-primary-300 px-4 py-3 text-primary-700 transition-colors hover:bg-primary-50">
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">
                {loading ? 'Carregando...' : `${displayProjects.length} projetos encontrados`}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-primary-600">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>
                    Em andamento: {projects.filter((p) => p.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" />
                  <span>Total: {projects.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <span className="ml-2 text-primary-600">Carregando projetos...</span>
              </div>
            ) : displayProjects.length === 0 ? (
              <div className="py-12 text-center">
                <Briefcase className="mx-auto mb-4 h-12 w-12 text-primary-300" />
                <h3 className="mb-2 text-lg font-medium text-primary-900">
                  Nenhum projeto encontrado
                </h3>
                <p className="mb-6 text-primary-600">Comece criando seu primeiro projeto.</p>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setShowModal(true);
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Criar Primeiro Projeto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`relative rounded-lg border p-6 transition-all hover:shadow-md ${getStatusColor(
                      project.status,
                    )}`}
                  >
                    {isOverdue(project) && (
                      <div className="absolute -right-2 -top-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold leading-tight text-primary-900">
                            {project.title}
                          </h3>
                          <p className="text-xs text-primary-500">{project.project_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-full border px-2 py-1 text-xs font-medium">
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-sm text-primary-600">
                        <User className="mr-2 h-4 w-4" />
                        <span className="truncate">{project.client_name}</span>
                      </div>
                      <div className="flex items-center text-sm text-primary-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          Entrega: {formatDate(new Date(project.due_date.seconds * 1000))}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-primary-600">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Orçamento: {formatCurrency(project.budget)}</span>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-primary-600">Prioridade: </span>
                        <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                          {getPriorityLabel(project.priority)}
                        </span>
                      </div>
                      <div className="text-sm text-primary-600">
                        <span className="font-medium">{project.progress || 0}%</span> concluído
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4 h-2 w-full rounded-full bg-primary-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white border-opacity-20 pt-4">
                      <div className="text-xs text-primary-500">
                        {project.created_at &&
                          formatDate(new Date(project.created_at.seconds * 1000))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700"
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
