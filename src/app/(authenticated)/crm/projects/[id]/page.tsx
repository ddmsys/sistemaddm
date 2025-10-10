// src/app/(authenticated)/crm/projects/[id]/page.tsx
'use client';

import { Timestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ProjectModal from '@/components/comercial/modals/ProjectModal'; // Corrigido import
import { useFirestore } from '@/hooks/useFirestore';
import { Client, Project, ProjectFormData } from '@/lib/types/projects'; // Types separados
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const { update, getById } = useFirestore<Project>('projects');
  const { data: clientsData } = useFirestore<Client>('clients');
  const clients = clientsData || [];

  // Mock users
  const users = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        router.push('/crm/projects');
        return;
      }

      try {
        setLoading(true);
        const projectData = await getById(projectId);
        if (projectData) {
          setProject(projectData as Project); // Cast para o tipo correto
        } else {
          console.error('Projeto não encontrado');
          router.push('/crm/projects');
        }
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        router.push('/crm/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, getById, router]);

  const handleUpdateProject = async (updatedData: ProjectFormData) => {
    if (!project?.id) return;

    try {
      const updatePayload = {
        ...updatedData,
        // Converter datas
        startDate: updatedData.startDate
          ? Timestamp.fromDate(new Date(updatedData.startDate))
          : project.startDate,
        dueDate: updatedData.dueDate
          ? Timestamp.fromDate(new Date(updatedData.dueDate))
          : project.dueDate,

        // Manter campos obrigatórios existentes
        progress: project.progress,
        teamMembers: project.teamMembers,
        actualCost: project.actualCost,
        files: project.files,
        tasks: project.tasks,
        timeline: project.timeline,
        proofsCount: project.proofsCount,

        updatedAt: Timestamp.now(),
      };

      try {
        await update(project.id, updatePayload);

        // Recarregar dados do projeto
        const refreshedProject = await getById(project.id);
        if (refreshedProject) {
          setProject(refreshedProject as Project);
        }
        setShowEditModal(false);
      } catch (error) {
        console.error('Erro ao atualizar projeto:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Carregando projeto...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Projeto não encontrado</h2>
          <p className="mt-2 text-gray-600">O projeto solicitado não existe ou foi removido.</p>
          <button
            onClick={() => router.push('/crm/projects')}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Voltar aos Projetos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-sm text-gray-600">
            {project.catalogCode || 'Código em processamento...'}
          </p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Editar Projeto
        </button>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Basic Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Informações Básicas</h3>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Cliente:</span>
              <p className="font-medium">{project.clientName}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <p className="font-medium">{project.status}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Prioridade:</span>
              <p className="font-medium">{project.priority}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Produto:</span>
              <p className="font-medium">{project.product}</p>
            </div>

            {project.description && (
              <div>
                <span className="text-sm text-gray-600">Descrição:</span>
                <p className="font-medium">{project.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Informações Financeiras</h3>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Orçamento:</span>
              <p className="font-medium">{formatCurrency(project.budget || 0)}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Custo Real:</span>
              <p className="font-medium">{formatCurrency(project.actualCost)}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Progresso:</span>
              <p className="font-medium">{project.progress}%</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Provas Enviadas:</span>
              <p className="font-medium">{project.proofsCount}</p>
            </div>
          </div>
        </div>

        {/* Timeline Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Cronograma</h3>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Data de Início:</span>
              <p className="font-medium">
                {formatDate(
                  project.startDate instanceof Date
                    ? project.startDate
                    : project.startDate.toDate(),
                )}
              </p>
            </div>

            {project.dueDate && (
              <div>
                <span className="text-sm text-gray-600">Data de Entrega:</span>
                <p className="font-medium">
                  {formatDate(
                    project.dueDate instanceof Date ? project.dueDate : project.dueDate.toDate(),
                  )}
                </p>
              </div>
            )}

            <div>
              <span className="text-sm text-gray-600">Criado em:</span>
              <p className="font-medium">
                {formatDate(
                  project.createdAt instanceof Date
                    ? project.createdAt
                    : project.createdAt.toDate(),
                )}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Atualizado em:</span>
              <p className="font-medium">
                {formatDate(
                  project.updatedAt instanceof Date
                    ? project.updatedAt
                    : project.updatedAt.toDate(),
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks and Timeline */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Tasks */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Tarefas</h3>

          {project.tasks.length === 0 ? (
            <p className="text-gray-600">Nenhuma tarefa cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {project.tasks.map((task, index) => (
                <div key={task.id || index} className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.status}</p>
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Arquivos</h3>

          {project.files.length === 0 ? (
            <p className="text-gray-600">Nenhum arquivo anexado.</p>
          ) : (
            <div className="space-y-3">
              {project.files.map((file, index) => (
                <div key={file.id || index} className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-600">{file.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {project.notes && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Observações</h3>
          <p className="text-gray-700">{project.notes}</p>
        </div>
      )}

      {/* Edit Modal */}
      <ProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateProject}
        project={project}
        clients={clients}
        users={users}
      />
    </div>
  );
}
