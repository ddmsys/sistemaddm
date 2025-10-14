// src/lib/types/production-projects.ts

// Tipos para gerenciamento de projetos de produção

import { Timestamp } from 'firebase/firestore';

// ==================== ENUMS ====================

export enum ProductionProjectStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum StageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  AWAITING_APPROVAL = 'awaiting_approval',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectStageType {
  TEXT_PREPARATION = 'text_preparation',
  REVISION = 'revision',
  LAYOUT = 'layout',
  COVER_CREATION = 'cover_creation',
  ISBN_CREATION = 'isbn_creation',
  CLIENT_APPROVAL = 'client_approval',
  PRINTING = 'printing',
  FINISHING = 'finishing',
  DELIVERY = 'delivery',
  OTHER = 'other',
}

// ==================== INTERFACES ====================

export interface StageFile {
  name: string;
  url: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
}

export interface ProjectStage {
  id: string;
  type: ProjectStageType;
  name: string;
  description?: string;
  status: StageStatus;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: Timestamp;
  dueDate?: Timestamp;
  completionDate?: Timestamp;
  files?: StageFile[];
  notes?: string;
  orderItemId?: string;
}

export interface ProjectUpdate {
  id: string;
  message: string;
  type: 'status_change' | 'stage_update' | 'comment' | 'file_upload';
  date: Timestamp;
  userId: string;
  userName: string;
  relatedStageId?: string;
}

export interface ProductionProject {
  id?: string;
  number: string;
  title: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  bookId?: string;
  bookTitle?: string;
  orderId?: string;
  status: ProductionProjectStatus;
  stages: ProjectStage[];
  progress: number;
  updates: ProjectUpdate[];
  startDate?: Timestamp;
  estimatedCompletionDate?: Timestamp;
  actualCompletionDate?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy?: string;
}

// ==================== FORM TYPES ====================

export interface ProductionProjectFormData {
  title: string;
  description?: string;

  // ✅ Campos para vinculação (opcionais)
  orderId?: string;
  clientId?: string;
  bookId?: string;

  // ✅ Datas de planejamento (opcionais)
  plannedStartDate?: Date;
  estimatedCompletionDate?: Date;

  dueDate?: Date;
  stages: Omit<ProjectStage, 'id' | 'status' | 'completionDate'>[];
  notes?: string;
}

export interface StageFormData {
  type: ProjectStageType;
  name: string;
  description?: string;
  startDate?: Date;
  dueDate?: Date;
  assigneeId?: string;
  assigneeName?: string;
  files?: Omit<StageFile, 'uploadedAt' | 'uploadedBy'>[]; // ✅ CORRIGIDO
  notes?: string;
  orderItemId?: string;
}

export interface StageUpdateData {
  status?: StageStatus;
  assigneeId?: string;
  assigneeName?: string;
  notes?: string;
  completionDate?: Timestamp;
}

// ==================== HELPER FUNCTIONS ====================

export function generateProjectNumber(year: number, sequential: number): string {
  return `PROJ-${year}-${sequential.toString().padStart(3, '0')}`;
}

export function calculateProgress(stages: ProjectStage[]): number {
  if (stages.length === 0) return 0;

  const completedStages = stages.filter((s) => s.status === StageStatus.COMPLETED).length;
  return Math.round((completedStages / stages.length) * 100);
}

export function validateProductionProject(data: ProductionProjectFormData): string[] {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push('Title is required');
  }

  if (!data.stages || data.stages.length === 0) {
    errors.push('At least one stage is required');
  }

  return errors;
}

export function validateStage(data: StageFormData): string | null {
  if (!data.name?.trim()) {
    return 'Stage name is required';
  }

  if (data.startDate && data.dueDate && data.startDate > data.dueDate) {
    return 'Start date cannot be after due date';
  }

  return null;
}

export function createProjectFromOrder(
  orderId: string,
  clientId: string,
  bookId: string,
  bookTitle: string,
): Omit<ProductionProject, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'createdBy'> {
  return {
    title: `Production - ${bookTitle}`,
    clientId,
    bookId,
    orderId,
    status: ProductionProjectStatus.NOT_STARTED,
    stages: [],
    progress: 0,
    updates: [],
  };
}

export function getProjectStatusLabel(status: ProductionProjectStatus): string {
  const labels: Record<ProductionProjectStatus, string> = {
    [ProductionProjectStatus.NOT_STARTED]: 'Não Iniciado',
    [ProductionProjectStatus.IN_PROGRESS]: 'Em Andamento',
    [ProductionProjectStatus.PAUSED]: 'Pausado',
    [ProductionProjectStatus.COMPLETED]: 'Concluído',
    [ProductionProjectStatus.CANCELLED]: 'Cancelado',
  };
  return labels[status];
}

export function getStageStatusLabel(status: StageStatus): string {
  const labels: Record<StageStatus, string> = {
    [StageStatus.PENDING]: 'Pendente',
    [StageStatus.IN_PROGRESS]: 'Em Andamento',
    [StageStatus.AWAITING_APPROVAL]: 'Aguardando Aprovação',
    [StageStatus.APPROVED]: 'Aprovado',
    [StageStatus.COMPLETED]: 'Concluído',
    [StageStatus.CANCELLED]: 'Cancelado',
  };
  return labels[status];
}

export function getStageTypeLabel(type: ProjectStageType): string {
  const labels: Record<ProjectStageType, string> = {
    [ProjectStageType.TEXT_PREPARATION]: 'Preparação de Texto',
    [ProjectStageType.REVISION]: 'Revisão',
    [ProjectStageType.LAYOUT]: 'Diagramação',
    [ProjectStageType.COVER_CREATION]: 'Criação de Capa',
    [ProjectStageType.ISBN_CREATION]: 'Criação de ISBN',
    [ProjectStageType.CLIENT_APPROVAL]: 'Aprovação do Cliente',
    [ProjectStageType.PRINTING]: 'Impressão',
    [ProjectStageType.FINISHING]: 'Acabamento',
    [ProjectStageType.DELIVERY]: 'Entrega',
    [ProjectStageType.OTHER]: 'Outro',
  };
  return labels[type];
}
