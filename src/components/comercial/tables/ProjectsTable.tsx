// src/components/comercial/tables/ProjectsTable.tsx
'use client';

import { Timestamp } from 'firebase/firestore';
import { AlertCircle, CheckCircle2, Clock, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Project, ProjectStatus } from '@/lib/types/projects';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface ProjectsTableProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onStatusChange?: (projectId: string, status: ProjectStatus) => void;
  onViewDetails?: (projectId: string) => void;
}

// ✅ Função auxiliar para converter Timestamp/Date para Date
function getJSDate(date: Date | Timestamp | undefined): Date {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  if (typeof (date as any).toDate === 'function') {
    return (date as Timestamp).toDate();
  }
  return new Date();
}

// Configuração de status
const statusConfig = {
  open: {
    label: 'Aberto',
    class: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: Clock,
  },
  design: {
    label: 'Design',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
  },
  review: {
    label: 'Revisão',
    class: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: AlertCircle,
  },
  production: {
    label: 'Produção',
    class: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  clientApproval: {
    label: 'Aprovação Cliente',
    class: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: AlertCircle,
  },
  approved: {
    label: 'Aprovado',
    class: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  printing: {
    label: 'Impressão',
    class: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Clock,
  },
  delivering: {
    label: 'Entregando',
    class: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: Clock,
  },
  shipped: {
    label: 'Enviado',
    class: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: CheckCircle2,
  },
  done: {
    label: 'Concluído',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelado',
    class: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
  },
};

const priorityConfig = {
  low: { label: 'Baixa', color: 'text-green-600' },
  medium: { label: 'Média', color: 'text-yellow-600' },
  high: { label: 'Alta', color: 'text-orange-600' },
  urgent: { label: 'Urgente', color: 'text-red-600' },
};

export function ProjectsTable({
  projects,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
}: ProjectsTableProps) {
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);

  if (projects.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Nenhum projeto encontrado</p>
          <p className="mt-1 text-sm text-gray-500">Crie seu primeiro projeto para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Projeto</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead className="text-right">Orçamento</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead className="text-right">Progresso</TableHead>
            <TableHead className="w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const status = statusConfig[project.status];
            const priority = priorityConfig[project.priority];
            const StatusIcon = status.icon;

            // ✅ Usar getJSDate para conversão segura
            const isOverdue =
              project.dueDate &&
              getJSDate(project.dueDate) < new Date() &&
              project.status !== 'done';

            return (
              <TableRow key={project.id} className="group">
                {/* Título e Código */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{project.title}</span>
                    <span className="text-xs text-gray-500">{project.catalogCode}</span>
                  </div>
                </TableCell>

                {/* Cliente */}
                <TableCell>
                  <span className="text-sm text-gray-700">{project.clientName}</span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge className={status.class}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>

                {/* Prioridade */}
                <TableCell>
                  <span className={cn('text-sm font-medium', priority.color)}>
                    {priority.label}
                  </span>
                </TableCell>

                {/* Orçamento */}
                <TableCell className="text-right">
                  <span className="text-sm font-medium">{formatCurrency(project.budget || 0)}</span>
                </TableCell>

                {/* Prazo */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {project.dueDate ? formatDate(getJSDate(project.dueDate)) : '-'}
                    </span>
                    {isOverdue && (
                      <span className="text-xs font-medium text-red-600">Atrasado</span>
                    )}
                  </div>
                </TableCell>

                {/* Progresso */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm font-medium">{project.progress}%</span>
                    <div className="h-2 w-16 rounded-full bg-gray-200">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          project.progress >= 100
                            ? 'bg-emerald-500'
                            : project.progress >= 75
                              ? 'bg-blue-500'
                              : project.progress >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500',
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Ações */}
                <TableCell>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowActionsFor(showActionsFor === project.id ? null : project.id!)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>

                    {showActionsFor === project.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActionsFor(null)}
                        />
                        <div className="absolute right-0 top-8 z-20 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                          {onViewDetails && (
                            <button
                              onClick={() => {
                                onViewDetails(project.id!);
                                setShowActionsFor(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              Ver Detalhes
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => {
                                onEdit(project);
                                setShowActionsFor(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                onDelete(project.id!);
                                setShowActionsFor(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Excluir
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
