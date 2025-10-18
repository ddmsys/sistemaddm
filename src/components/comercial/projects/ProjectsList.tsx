// src/components/comercial/projects/ProjectsList.tsx

"use client";

import { Filter, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ProjectCard } from "@/components/comercial/cards/ProjectCard";
import ProjectModal from "@/components/comercial/modals/ProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClients } from "@/hooks/comercial/useClients";
import { useProjects } from "@/hooks/comercial/useProjects";
import type {
  ProductType,
  Project,
  ProjectFormData,
  ProjectPriority,
  ProjectStatus,
} from "@/lib/types/projects";

// ==================== CONSTANTS ====================

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "open", label: "Aberto" },
  { value: "design", label: "Design" },
  { value: "review", label: "Revisão" },
  { value: "production", label: "Produção" },
  { value: "clientApproval", label: "Aprovação Cliente" },
  { value: "approved", label: "Aprovado" },
  { value: "printing", label: "Impressão" },
  { value: "delivering", label: "Entrega" },
  { value: "shipped", label: "Enviado" },
  { value: "done", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
];

const PRIORITY_OPTIONS: { value: ProjectPriority; label: string; color: string }[] = [
  { value: "low", label: "Baixa", color: "text-green-600" },
  { value: "medium", label: "Média", color: "text-yellow-600" },
  { value: "high", label: "Alta", color: "text-orange-600" },
  { value: "urgent", label: "Urgente", color: "text-red-600" },
];

const PRODUCT_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "L", label: "Livro" },
  { value: "E", label: "E-book" },
  { value: "K", label: "kindle" },
  { value: "C", label: "CD" },
  { value: "D", label: "DVD" },
  { value: "G", label: "Gráfica" },
  { value: "P", label: "PlatafDigital" },
  { value: "S", label: "Single" },
  { value: "X", label: "LivroTerc" },
  { value: "A", label: "Arte" },
];

const ITEMS_PER_PAGE = 12;

// ==================== INTERFACES ====================

interface ProjectsListProps {
  clientId?: string; // Se fornecido, filtra por cliente
  showFilters?: boolean;
  showCreateButton?: boolean;
  compact?: boolean;
}

interface Filters {
  search: string;
  status: ProjectStatus | "all";
  priority: ProjectPriority | "all";
  product: ProductType | "all";
}

// ==================== COMPONENT ====================

export function ProjectsList({
  clientId,
  showFilters = true,
  showCreateButton = true,
  compact = false,
}: ProjectsListProps) {
  // ===== STATES =====
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    priority: "all",
    product: "all",
  });

  // ===== HOOKS =====
  const { clients } = useClients();

  // ✅ Hook useProjects com filtros opcionais
  const {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    // updateProjectProgress, // Não usado no momento
  } = useProjects({
    clientId: clientId,
    realtime: true,
  });

  // ===== FILTERED PROJECTS =====
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Filtro de busca (título, descrição, catalogCode)
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description?.toLowerCase().includes(searchLower) ||
          project.catalogCode?.toLowerCase().includes(searchLower) ||
          project.clientName?.toLowerCase().includes(searchLower),
      );
    }

    // Filtro de status
    if (filters.status !== "all") {
      filtered = filtered.filter((project) => project.status === filters.status);
    }

    // Filtro de prioridade
    if (filters.priority !== "all") {
      filtered = filtered.filter((project) => project.priority === filters.priority);
    }

    // Filtro de produto
    if (filters.product !== "all") {
      filtered = filtered.filter((project) => project.product === filters.product);
    }

    return filtered;
  }, [projects, filters]);

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset page when filters change
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // ===== HANDLERS =====
  const handleCreate = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleSave = async (data: ProjectFormData) => {
    try {
      if (selectedProject?.id) {
        await updateProject(selectedProject.id, data as Partial<Project>);
        toast.success("Projeto atualizado com sucesso!");
      } else {
        await createProject(data);
        toast.success("Projeto criado com sucesso!");
      }
      setShowModal(false);
      setSelectedProject(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar projeto";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este projeto?")) return;

    try {
      await deleteProject(id);
      toast.success("Projeto excluído com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir projeto";
      toast.error(message);
    }
  };

  const handleStatusChange = async (id: string, status: ProjectStatus) => {
    try {
      await updateProjectStatus(id, status);
      toast.success("Status atualizado!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar status";
      toast.error(message);
    }
  };

  // Remover variável não usada (handleProgressChange)
  // const handleProgressChange = async (id: string, progress: number) => { ... }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      product: "all",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.product !== "all";

  // ===== RENDER =====

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">Erro ao carregar projetos: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Projetos {clientId && "- Cliente Específico"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredProjects.length} {filteredProjects.length === 1 ? "projeto" : "projetos"}
            {hasActiveFilters && " (filtrado)"}
          </p>
        </div>

        <div className="flex gap-2">
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                  {[
                    filters.search && 1,
                    filters.status !== "all" && 1,
                    filters.priority !== "all" && 1,
                    filters.product !== "all" && 1,
                  ]
                    .filter(Boolean)
                    .reduce((a, b) => (a as number) + (b as number), 0)}
                </span>
              )}
            </Button>
          )}

          {showCreateButton && (
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Projeto
            </Button>
          )}
        </div>
      </div>

      {/* ===== FILTER PANEL ===== */}
      {showFilters && showFilterPanel && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Busca */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Título, código..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  handleFilterChange({ status: value as ProjectStatus | "all" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Prioridade</label>
              <Select
                value={filters.priority}
                onValueChange={(value) =>
                  handleFilterChange({ priority: value as ProjectPriority | "all" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={option.color}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Produto */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Produto</label>
              <Select
                value={filters.product}
                onValueChange={(value) =>
                  handleFilterChange({ product: value as ProductType | "all" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {PRODUCT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={handleClearFilters} className="gap-2 text-sm">
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ===== LOADING STATE ===== */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg border bg-gray-100" />
          ))}
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && filteredProjects.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {hasActiveFilters ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {hasActiveFilters
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece criando seu primeiro projeto."}
          </p>
          {hasActiveFilters ? (
            <Button onClick={handleClearFilters} variant="outline" className="mt-6">
              Limpar Filtros
            </Button>
          ) : (
            showCreateButton && (
              <Button onClick={handleCreate} className="mt-6">
                Criar Primeiro Projeto
              </Button>
            )
          )}
        </div>
      )}

      {/* ===== PROJECTS GRID ===== */}
      {!loading && paginatedProjects.length > 0 && (
        <div
          className={`grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
        >
          {paginatedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project.id!)}
              onStatusChange={(status) => handleStatusChange(project.id!, status as ProjectStatus)}
            />
          ))}
        </div>
      )}

      {/* ===== PAGINATION ===== */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-500">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProjects.length)} de{" "}
            {filteredProjects.length} projetos
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Mostrar apenas páginas próximas
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[2.5rem]"
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {/* ===== MODAL ===== */}
      {showModal && (
        <ProjectModal
          isOpen={showModal}
          project={selectedProject}
          clients={clients.map((c) => ({
            id: c.id!,
            name: c.name,
            email: c.email,
            status: c.status,
          }))}
          users={[]} // TODO: Adicionar lista de usuários quando disponível
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
