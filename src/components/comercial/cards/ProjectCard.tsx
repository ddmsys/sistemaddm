// src/components/comercial/cards/ProjectCard.tsx
'use client';

import { AlertCircle, CheckCircle2, Clock, MoreHorizontal, Play, User, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { Project, ProjectStatus } from '@/lib/types/projects'; // Corrigido import
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onStatusChange?: (projectId: string, status: ProjectStatus) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
}

// ================ CONFIGURAÇÕES ================
const statusConfig = {
  open: {
    label: 'Aberto',
    color: 'secondary',
    class: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: Clock,
  },
  design: {
    label: 'Design',
    color: 'info',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Play,
  },
  review: {
    label: 'Revisão',
    color: 'warning',
    class: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: AlertCircle,
  },
  production: {
    label: 'Produção',
    color: 'warning',
    class: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Play,
  },
  clientApproval: {
    label: 'Aprovação Cliente',
    color: 'warning',
    class: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: User,
  },
  approved: {
    label: 'Aprovado',
    color: 'success',
    class: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  printing: {
    label: 'Impressão',
    color: 'info',
    class: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Play,
  },
  delivering: {
    label: 'Entregando',
    color: 'info',
    class: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: Play,
  },
  shipped: {
    label: 'Enviado',
    color: 'info',
    class: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: CheckCircle2,
  },
  done: {
    label: 'Concluído',
    color: 'success',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'destructive',
    class: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
  },
};

const typeConfig = {
  L: { label: 'Livro', icon: '📖' },
  E: { label: 'E-book', icon: '📱' },
  K: { label: 'Kindle', icon: '📱' },
  C: { label: 'CD', icon: '💿' },
  D: { label: 'DVD', icon: '📀' },
  G: { label: 'Material Gráfico', icon: '🎨' },
  P: { label: 'Plataforma Digital', icon: '💻' },
  S: { label: 'Single', icon: '🎵' },
  X: { label: 'Livro Terceiros', icon: '📚' },
  A: { label: 'Arte', icon: '🎭' },
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

  // ================ CONFIGURAÇÕES ================
  const status = statusConfig[project.status];
  const type = typeConfig[project.product]; // Corrigido de .type para .product
  const priority = priorityConfig[project.priority];
  const StatusIcon = status.icon;

  // ================ CÁLCULOS ================
  const isOverdue =
    project.dueDate &&
    (project.dueDate instanceof Date ? project.dueDate : project.dueDate.toDate()) < new Date() &&
    project.status !== 'done';

  const daysUntilDue = project.dueDate
    ? Math.ceil(
        ((project.dueDate instanceof Date ? project.dueDate : project.dueDate.toDate()).getTime() -
          new Date().getTime()) /
          (1000 * 3600 * 24),
      )
    : null;

  const completedTasks = project.tasks.filter((task) => task.status === 'done').length;
  const totalTasks = project.tasks.length;

  const taskProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progress;

  return (
    <>
      <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">{project.title}</h3>
            <p className="text-xs text-primary-500">
              {project.catalogCode || 'Código em processamento...'}
            </p>
            <p className="mt-1 truncate text-sm text-gray-600">
              <User className="mr-1 inline h-4 w-4" />
              {project.clientName}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={status.class}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowActions(true)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 pb-6">
          {/* Type & Priority */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="mr-2">{type.icon}</span>
              <span className="text-gray-600">{type.label}</span>
            </div>
            <Badge className={`${priority.bg} ${priority.color}`}>{priority.label}</Badge>
          </div>

          {/* Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{taskProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
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
            <div className="text-sm">
              <span className="text-gray-600">Tarefas: </span>
              <span className="font-medium">
                {completedTasks}/{totalTasks} concluídas
              </span>
            </div>
          )}

          {/* Budget vs Cost */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Orçamento:</span>
              <span className="font-medium">{formatCurrency(project.budget || 0)}</span>
            </div>
            {project.actualCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Custo Real:</span>
                <span
                  className={cn(
                    'font-medium',
                    project.actualCost > (project.budget || 0)
                      ? 'text-red-600'
                      : 'text-emerald-600',
                  )}
                >
                  {formatCurrency(project.actualCost)}
                </span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Início:</span>
              <span>
                {formatDate(
                  project.startDate instanceof Date
                    ? project.startDate
                    : project.startDate.toDate(),
                )}
              </span>
            </div>
            {project.dueDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Prazo:</span>
                <div className="flex items-center">
                  {formatDate(
                    project.dueDate instanceof Date ? project.dueDate : project.dueDate.toDate(),
                  )}
                  {daysUntilDue !== null && daysUntilDue > 0 && daysUntilDue <= 7 && (
                    <span className="ml-2 text-xs text-amber-600">({daysUntilDue}d)</span>
                  )}
                  {isOverdue && <span className="ml-2 text-xs text-red-600">(Atrasado)</span>}
                </div>
              </div>
            )}
          </div>

          {/* Team */}
          {project.teamMembers.length > 0 && (
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Equipe: </span>
              <span>{project.teamMembers.length} membros</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails?.(project.id!)}
            >
              Ver Detalhes
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit?.(project)}>
              Editar
            </Button>
          </div>
        </div>

        {/* Overdue Indicator */}
        {isOverdue && (
          <div className="absolute right-0 top-0 rounded-bl bg-red-500 px-2 py-1 text-xs text-white">
            Atrasado
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
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onViewDetails?.(project.id!);
              setShowActions(false);
            }}
          >
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

          {/* Status change options */}
          {Object.entries(statusConfig).map(([key, config]) => (
            <Button
              key={key}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onStatusChange?.(project.id!, key as ProjectStatus);
                setShowActions(false);
              }}
            >
              Alterar para {config.label}
            </Button>
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600"
            onClick={() => {
              onDelete?.(project.id!);
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
