'use client';

import { Package, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useProductionProjects } from '@/hooks/comercial/useProductionProjects';
import { useAuth } from '@/hooks/useAuth';
import {
  ProductionProject,
  ProductionProjectStatus,
  getProjectStatusLabel,
} from '@/lib/types/production-projects';

export default function ProductionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { projects, loading } = useProductionProjects({ realtime: true });
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Faça login para continuar</p>
      </div>
    );
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Agrupar por status
  const projectsByStatus = {
    not_started: filteredProjects.filter((p) => p.status === ProductionProjectStatus.NOT_STARTED),
    in_progress: filteredProjects.filter((p) => p.status === ProductionProjectStatus.IN_PROGRESS),
    paused: filteredProjects.filter((p) => p.status === ProductionProjectStatus.PAUSED),
    completed: filteredProjects.filter((p) => p.status === ProductionProjectStatus.COMPLETED),
  };

  const stats = {
    total: projects.length,
    notStarted: projectsByStatus.not_started.length,
    inProgress: projectsByStatus.in_progress.length,
    completed: projectsByStatus.completed.length,
  };

  const statusColors: Record<string, string> = {
    not_started: 'bg-gray-100 border-gray-300',
    in_progress: 'bg-blue-50 border-blue-300',
    paused: 'bg-yellow-50 border-yellow-300',
    completed: 'bg-green-50 border-green-300',
  };

  const statusBadgeColors: Record<string, string> = {
    not_started: 'bg-gray-200 text-gray-800',
    in_progress: 'bg-blue-200 text-blue-800',
    paused: 'bg-yellow-200 text-yellow-800',
    completed: 'bg-green-200 text-green-800',
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produção</h1>
        <button
          onClick={() => router.push('/production/new')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo Projeto
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Não Iniciados</p>
              <p className="text-2xl font-bold">{stats.notStarted}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4"
          />
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Não Iniciados */}
          <div className={`rounded-lg border-2 p-4 ${statusColors.not_started}`}>
            <h2 className="mb-4 flex items-center justify-between font-semibold">
              <span>Não Iniciados</span>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-800">
                {projectsByStatus.not_started.length}
              </span>
            </h2>
            <div className="space-y-3">
              {projectsByStatus.not_started.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  statusBadgeColors={statusBadgeColors}
                  onClick={() => router.push(`/production/${project.id}`)}
                />
              ))}
              {projectsByStatus.not_started.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">Nenhum projeto</p>
              )}
            </div>
          </div>

          {/* Em Andamento */}
          <div className={`rounded-lg border-2 p-4 ${statusColors.in_progress}`}>
            <h2 className="mb-4 flex items-center justify-between font-semibold">
              <span>Em Andamento</span>
              <span className="rounded-full bg-blue-200 px-2 py-1 text-sm text-blue-800">
                {projectsByStatus.in_progress.length}
              </span>
            </h2>
            <div className="space-y-3">
              {projectsByStatus.in_progress.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  statusBadgeColors={statusBadgeColors}
                  onClick={() => router.push(`/production/${project.id}`)}
                />
              ))}
              {projectsByStatus.in_progress.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">Nenhum projeto</p>
              )}
            </div>
          </div>

          {/* Pausados */}
          <div className={`rounded-lg border-2 p-4 ${statusColors.paused}`}>
            <h2 className="mb-4 flex items-center justify-between font-semibold">
              <span>Pausados</span>
              <span className="rounded-full bg-yellow-200 px-2 py-1 text-sm text-yellow-800">
                {projectsByStatus.paused.length}
              </span>
            </h2>
            <div className="space-y-3">
              {projectsByStatus.paused.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  statusBadgeColors={statusBadgeColors}
                  onClick={() => router.push(`/production/${project.id}`)}
                />
              ))}
              {projectsByStatus.paused.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">Nenhum projeto</p>
              )}
            </div>
          </div>

          {/* Concluídos */}
          <div className={`rounded-lg border-2 p-4 ${statusColors.completed}`}>
            <h2 className="mb-4 flex items-center justify-between font-semibold">
              <span>Concluídos</span>
              <span className="rounded-full bg-green-200 px-2 py-1 text-sm text-green-800">
                {projectsByStatus.completed.length}
              </span>
            </h2>
            <div className="space-y-3">
              {projectsByStatus.completed.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  statusBadgeColors={statusBadgeColors}
                  onClick={() => router.push(`/production/${project.id}`)}
                />
              ))}
              {projectsByStatus.completed.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">Nenhum projeto</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Card Component
function ProjectCard({
  project,
  statusBadgeColors,
  onClick,
}: {
  project: ProductionProject;
  statusBadgeColors: Record<string, string>;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="line-clamp-2 text-sm font-medium">{project.title}</h3>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${statusBadgeColors[project.status]}`}
        >
          {getProjectStatusLabel(project.status)}
        </span>
      </div>

      <p className="mb-2 text-xs text-gray-600">{project.number}</p>

      {project.clientName && (
        <p className="mb-2 text-xs text-gray-500">Cliente: {project.clientName}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{project.stages.length} etapas</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-blue-600 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="font-medium text-gray-600">{project.progress}%</span>
        </div>
      </div>
    </div>
  );
}
