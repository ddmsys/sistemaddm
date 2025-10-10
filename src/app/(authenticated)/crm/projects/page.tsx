// src/app/(authenticated)/crm/projects/page.tsx
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

import ProjectModal from '@/components/comercial/modals/ProjectModal'; // Corrigido import
import { useFirestore } from '@/hooks/useFirestore'; // Voltando para o hook original
import {
  Client,
  Project,
  ProjectFormData,
  ProjectPriority,
  ProjectStatus,
} from '@/lib/types/projects'; // Usando types separados
import { formatCurrency, formatDate } from '@/lib/utils';

interface FilterState {
  status: ProjectStatus | '';
  priority: ProjectPriority | '';
  search: string;
}

export default function ProjectsPage() {
  // ================ HOOKS ================
  const { data: projects, loading, create, update, remove } = useFirestore<Project>('projects'); // Usando hook original

  const { data: clientsData } = useFirestore<Client>('clients');
  const clients = clientsData || [];

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priority: '',
    search: '',
  });

  // Mock users - substituir por dados reais do contexto de usuários
  const users = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  // ================ HANDLERS ================
  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      if (selectedProject) {
        // Editando projeto existente
        await update(selectedProject.id!, {
          ...data,
          // Converter datas corretamente
          startDate: data.startDate
            ? Timestamp.fromDate(new Date(data.startDate))
            : Timestamp.now(),
          dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined,

          // Campos obrigatórios
          progress: selectedProject.progress || 0,
          teamMembers: selectedProject.teamMembers || [],
          actualCost: selectedProject.actualCost || 0,
          files: selectedProject.files || [],
          tasks: selectedProject.tasks || [],
          timeline: selectedProject.timeline || [],
          proofsCount: selectedProject.proofsCount || 0,

          updatedAt: Timestamp.now(),
        });
      } else {
        // Criando novo projeto - garantir todos campos obrigatórios
        const projectData: Omit<Project, 'id'> = {
          // Relacionamentos
          clientId: data.clientId,
          clientName: data.clientName || '',
          quoteId: data.quoteId,

          // Dados básicos OBRIGATÓRIOS
          title: data.title,
          description: data.description || '',
          product: data.product,
          status: data.status || 'open',
          priority: data.priority || 'medium',

          // Datas OBRIGATÓRIAS
          startDate: data.startDate
            ? Timestamp.fromDate(new Date(data.startDate))
            : Timestamp.now(),
          dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined,

          // Campos OBRIGATÓRIOS para gestão
          progress: 0,
          teamMembers: [],
          projectManager: data.projectManager,
          actualCost: 0,

          // Arrays OBRIGATÓRIOS (vazios inicialmente)
          files: [],
          tasks: [],
          timeline: [],

          // Campos OBRIGATÓRIOS de gestão
          proofsCount: 0,

          // Campos opcionais
          specifications: data.specifications,
          budget: data.budget || 0,
          assignedTo: data.assignedTo,
          clientApprovalTasks: [],
          tags: [],
          notes: data.notes || '',
          createdBy: 'user-id', // Pegar do contexto de auth

          // Timestamps OBRIGATÓRIOS
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await create(projectData);
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

  // ================ CONFIGURAÇÕES ================
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'open', label: 'Aberto' },
    { value: 'design', label: 'Design' },
    { value: 'review', label: 'Revisão' },
    { value: 'production', label: 'Produção' },
    { value: 'clientApproval', label: 'Aprovação Cliente' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'printing', label: 'Impressão' },
    { value: 'delivering', label: 'Entregando' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'done', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' },
  ];

  // ================ FUNÇÕES AUXILIARES ================
  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      open: 'bg-gray-50 text-gray-700 border-gray-200',
      design: 'bg-blue-50 text-blue-700 border-blue-200',
      review: 'bg-purple-50 text-purple-700 border-purple-200',
      production: 'bg-amber-50 text-amber-700 border-amber-200',
      clientApproval: 'bg-orange-50 text-orange-700 border-orange-200',
      approved: 'bg-green-50 text-green-700 border-green-200',
      printing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      delivering: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      shipped: 'bg-teal-50 text-teal-700 border-teal-200',
      done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || colors.open;
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      open: 'Aberto',
      design: 'Design',
      review: 'Revisão',
      production: 'Produção',
      clientApproval: 'Aprovação Cliente',
      approved: 'Aprovado',
      printing: 'Impressão',
      delivering: 'Entregando',
      shipped: 'Enviado',
      done: 'Concluído',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
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

  // ================ FILTROS ================
  const displayProjects = (projects || []).filter((project: Project) => {
    if (filters.status && project.status !== filters.status) return false;
    if (filters.priority && project.priority !== filters.priority) return false;
    if (
      filters.search &&
      !project.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !project.clientName?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !project.catalogCode?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const isOverdue = (project: Project) => {
    if (!project.dueDate) return false;

    const dueDate = project.dueDate instanceof Date ? project.dueDate : project.dueDate.toDate();

    return dueDate < new Date() && project.status !== 'done' && project.status !== 'cancelled';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="mt-2 text-gray-600">Gerencie seus projetos em andamento</p>
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
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Buscar projetos</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Título, cliente, código..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Prioridade</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
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

        <div className="flex items-end">
          <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loading ? 'Carregando...' : `${displayProjects.length} projetos encontrados`}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            Em andamento:{' '}
            {
              (projects || []).filter(
                (p: Project) => p.status === 'design' || p.status === 'production',
              ).length
            }
          </span>
          <span>Total: {projects?.length || 0}</span>
        </div>
      </div>

      {/* Projects Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Carregando projetos...</div>
        </div>
      ) : displayProjects.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhum projeto encontrado</h3>
          <p className="mt-2 text-gray-600">Comece criando seu primeiro projeto.</p>
          <button
            onClick={() => {
              setSelectedProject(null);
              setShowModal(true);
            }}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Criar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project: Project) => (
            <div
              key={project.id}
              className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Overdue indicator */}
              {isOverdue(project) && (
                <div className="absolute right-2 top-2 flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Atrasado
                </div>
              )}

              {/* Header */}
              <div className="mb-4">
                <h3 className="truncate text-lg font-semibold text-gray-900">{project.title}</h3>
                <p className="text-xs text-primary-500">
                  {project.catalogCode || 'Código em processamento...'}
                </p>
              </div>

              {/* Status */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
                >
                  {getStatusLabel(project.status)}
                </span>
              </div>

              {/* Client */}
              <div className="mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate">{project.clientName}</span>
                </div>
              </div>

              {/* Due Date */}
              {project.dueDate && (
                <div className="mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Entrega:{' '}
                    {formatDate(
                      project.dueDate instanceof Date ? project.dueDate : project.dueDate.toDate(),
                    )}
                  </div>
                </div>
              )}

              {/* Budget */}
              {project.budget && (
                <div className="mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Orçamento: {formatCurrency(project.budget)}
                  </div>
                </div>
              )}

              {/* Priority */}
              <div className="mb-4 text-sm">
                <span className="text-gray-600">Prioridade: </span>
                <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                  {getPriorityLabel(project.priority)}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">{project.progress || 0}% concluído</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Created date */}
              <div className="text-xs text-gray-500">
                Criado em:{' '}
                {project.createdAt &&
                  formatDate(
                    project.createdAt instanceof Date
                      ? project.createdAt
                      : project.createdAt.toDate(),
                  )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id!)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
  );
}
