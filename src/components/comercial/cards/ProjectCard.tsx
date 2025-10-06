'use client';

import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  MoreHorizontal,
  Pause,
  Play,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { Project, ProjectStatus } from '@/lib/types';
import { calculateProgress, cn, formatCurrency, formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onStatusChange?: (projectId: string, status: ProjectStatus) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
}

const statusConfig = {
  approved: {
    label: 'Aprovado',
    color: 'info',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: CheckCircle2,
  },
  in_production: {
    label: 'Em Produção',
    color: 'warning',
    class: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Play,
  },
  review: {
    label: 'Revisão',
    color: 'secondary',
    class: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: AlertCircle,
  },
  client_approval: {
    label: 'Aprovação Cliente',
    color: 'warning',
    class: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: User,
  },
  completed: {
    label: 'Concluído',
    color: 'success',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  on_hold: {
    label: 'Pausado',
    color: 'secondary',
    class: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: Pause,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'destructive',
    class: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
  },
};

const typeConfig = {
  livro_fisico: { label: 'Livro Físico', icon: '📖' },
  ebook: { label: 'E-book', icon: '📱' },
  audiobook: { label: 'Audiobook', icon: '🎧' },
  revista: { label: 'Revista', icon: '📰' },
  catalogo: { label: 'Catálogo', icon: '📋' },
  material_promocional: { label: 'Material Promocional', icon: '📢' },
  outros: { label: 'Outros', icon: '📄' },
};

const priorityConfig = {
  low: { label: 'Baixa', color: 'text-green-600', bg: 'bg-green-100' },
  medium: { label: 'Média', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  high: { label: 'Alta', color: 'text-orange-600', bg: 'bg-orange-100' },
  urgent: { label: 'Urgente', color: 'text-red-600', bg: 'bg-red-100' },
};

export function ProjectCard({
  project,
  onStatusChange,
  onEdit,
  onDelete,
  onViewDetails,
}: ProjectCardProps) {
  const [showActions, setShowActions] = useState(false);
  const status = statusConfig[project.status];
  const type = typeConfig[project.type];
  const priority = priorityConfig[project.priority];
  const StatusIcon = status.icon;

  const isOverdue = project.due_date.toDate() < new Date() && project.status !== 'completed';
  const daysUntilDue = Math.ceil(
    (project.due_date.toDate().getTime() - new Date().getTime()) / (1000 * 3600 * 24),
  );

  const completedTasks = project.tasks.filter((task) => task.status === 'done').length;
  const totalTasks = project.tasks.length;
  const taskProgress =
    totalTasks > 0 ? calculateProgress(completedTasks, totalTasks) : project.progress;

  return (
    <>
      <Card
        variant="interactive"
        className={cn(
          'group relative transition-all duration-200 hover:shadow-lg',
          status.class,
          isOverdue && 'ring-2 ring-red-200',
        )}
      >
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <StatusIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-primary-900">{project.title}</h3>
                <p className="text-xs text-primary-500">{project.project_code}</p>
                <div className="mt-1 flex items-center text-xs text-primary-600">
                  <User className="mr-1 h-3 w-3" />
                  <span className="truncate">{project.client_name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  status.color as
                    | 'default'
                    | 'secondary'
                    | 'success'
                    | 'warning'
                    | 'destructive'
                    | 'info'
                    | 'outline'
                }
                size="sm"
              >
                {status.label}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setShowActions(true)}
              >
                <MoreHorizontal className="w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 px-4 pb-4">
          {/* Type & Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-primary-600">
              <span className="mr-1">{type.icon}</span>
              {type.label}
            </div>

            <div
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                priority.color,
                priority.bg,
              )}
            >
              {priority.label}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary-600">Progresso</span>
              <span className="font-medium text-primary-900">{taskProgress}%</span>
            </div>

            <div className="h-2 w-full rounded-full bg-primary-200">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  taskProgress >= 100
                    ? 'bg-emerald-500'
                    : taskProgress >= 75
                      ? 'bg-blue-500'
                      : taskProgress >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500',
                )}
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </div>

          {/* Tasks Summary */}
          {totalTasks > 0 && (
            <div className="flex items-center justify-between text-xs text-primary-600">
              <span>Tarefas</span>
              <span>
                {completedTasks}/{totalTasks} concluídas
              </span>
            </div>
          )}

          {/* Budget vs Cost */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-primary-600">
              <span>Orçamento:</span>
              <span className="font-medium text-primary-900">{formatCurrency(project.budget)}</span>
            </div>
            {project.actual_cost > 0 && (
              <div className="flex items-center justify-between text-primary-600">
                <span>Custo Real:</span>
                <span
                  className={cn(
                    'font-medium',
                    project.actual_cost > project.budget ? 'text-red-600' : 'text-emerald-600',
                  )}
                >
                  {formatCurrency(project.actual_cost)}
                </span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-1 text-xs text-primary-600">
            <div className="flex items-center justify-between">
              <span>Início:</span>
              <span>{formatDate(project.start_date.toDate())}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Prazo:</span>
              <span className={cn(isOverdue && 'font-medium text-red-600')}>
                {formatDate(project.due_date.toDate())}
                {daysUntilDue > 0 && daysUntilDue <= 7 && (
                  <span className="ml-1">({daysUntilDue}d)</span>
                )}
                {isOverdue && <span className="ml-1">(Atrasado)</span>}
              </span>
            </div>
          </div>

          {/* Team */}
          {project.team_members.length > 0 && (
            <div className="flex items-center justify-between text-xs text-primary-600">
              <span>Equipe</span>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                <span>{project.team_members.length} membros</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 px-4 pb-3 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="default"
            className="text-xs"
            onClick={() => onViewDetails?.(project.id)}
          >
            Ver Detalhes
          </Button>

          <Button size="sm" variant="outline" className="text-xs" onClick={() => onEdit?.(project)}>
            Editar
          </Button>
        </div>

        {/* Overdue Indicator */}
        {isOverdue && (
          <div className="absolute -right-2 -top-2">
            <Badge variant="destructive" className="animate-pulse text-xs">
              Atrasado
            </Badge>
          </div>
        )}
      </Card>

      {/* Actions Modal */}
      <Modal
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Ações do Projeto"
        size="sm"
      >
        <div className="space-y-2">
          <Button
            variant="default"
            className="w-full justify-start"
            onClick={() => {
              onViewDetails?.(project.id);
              setShowActions(false);
            }}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onEdit?.(project);
              setShowActions(false);
            }}
          >
            Editar Projeto
          </Button>

          <hr className="my-2" />

          {Object.entries(statusConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={project.status === key ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                onStatusChange?.(project.id, key as ProjectStatus);
                setShowActions(false);
              }}
            >
              Alterar para {config.label}
            </Button>
          ))}

          <hr className="my-2" />

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={() => {
              onDelete?.(project.id);
              setShowActions(false);
            }}
          >
            Excluir Projeto
          </Button>
        </div>
      </Modal>
    </>
  );
}
