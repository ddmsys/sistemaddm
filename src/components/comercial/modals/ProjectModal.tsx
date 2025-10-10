// src/components/comercial/modals/ProjectModal.tsx
'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import {
  Client,
  ProductType,
  Project,
  ProjectFormData,
  ProjectPriority,
  ProjectSpecifications,
} from '@/lib/types/projects'; // CORRIGIDO: só importa de projects.ts

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  project?: Project | null;
  clients: Client[];
  users: { id: string; name: string }[];
}

const projectTypes = [
  { value: 'L', label: 'Livro' },
  { value: 'E', label: 'E-book' },
  { value: 'K', label: 'Kindle' },
  { value: 'C', label: 'CD' },
  { value: 'D', label: 'DVD' }, // Corrigido de 'DVD' para 'D'
  { value: 'G', label: 'Material Gráfico' },
  { value: 'P', label: 'Plataforma Digital' },
  { value: 'S', label: 'Single' },
  { value: 'X', label: 'Livro Terceiros' },
  { value: 'A', label: 'Arte' },
];

const priorities: { value: ProjectPriority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

export default function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  clients,
  users,
}: ProjectModalProps) {
  // ================ INICIALIZAÇÃO DO FORM ================
  const [formData, setFormData] = useState<ProjectFormData>(() => ({
    clientId: project?.clientId || '',
    clientName: project?.clientName || '',
    quoteId: project?.quoteId || '',
    title: project?.title || '',
    description: project?.description || '',
    product: project?.product || 'L', // Corrigido de ProductType
    priority: project?.priority || 'medium',
    projectManager: project?.projectManager || '', // OBRIGATÓRIO
    assignedTo: project?.assignedTo || '',
    budget: project?.budget || 0,
    notes: project?.notes || '',

    // Datas corrigidas
    dueDate: project?.dueDate
      ? project.dueDate instanceof Date
        ? project.dueDate.toISOString().split('T')[0]
        : new Date(project.dueDate.toDate()).toISOString().split('T')[0] // Timestamp
      : '',
    startDate: project?.startDate
      ? project.startDate instanceof Date
        ? project.startDate.toISOString().split('T')[0]
        : new Date(project.startDate.toDate()).toISOString().split('T')[0] // Timestamp
      : '',

    // Especificações inicializadas
    specifications: project?.specifications || {
      format: '',
      pages: 0,
      copies: 0,
      paperType: '',
      binding: '',
      colors: '',
      finishing: [],
      specialRequirements: '',
    },
  }));

  const [loading, setLoading] = useState(false);

  // ================ HANDLERS ================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação crítica
    if (!formData.title?.trim()) {
      alert('Título é obrigatório');
      return;
    }

    if (!formData.clientId) {
      alert('Cliente é obrigatório');
      return;
    }

    if (!formData.projectManager) {
      alert('Gerente do projeto é obrigatório');
      return;
    }

    setLoading(true);

    try {
      // Garantir que budget nunca seja undefined
      const submitData: ProjectFormData = {
        ...formData,
        budget: formData.budget || 0,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler para especificações
  const handleSpecificationChange = (field: keyof ProjectSpecifications, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      } as ProjectSpecifications,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {project ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 transition-colors hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* ================ INFORMAÇÕES BÁSICAS ================ */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Cliente */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Cliente *</label>
              <select
                value={formData.clientId}
                onChange={(e) => {
                  const selectedClient = clients.find((c) => c.id === e.target.value);
                  handleInputChange('clientId', e.target.value);
                  handleInputChange('clientName', selectedClient?.name || '');
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients
                  .filter((client) => client.status === 'active')
                  .map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Tipo do Produto */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo do Produto *
              </label>
              <select
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value as ProductType)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                required
              >
                {projectTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Título do Projeto *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o título do projeto"
                required
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o projeto..."
              />
            </div>

            {/* Gerente do Projeto */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Gerente do Projeto *
              </label>
              <select
                value={formData.projectManager}
                onChange={(e) => handleInputChange('projectManager', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um gerente</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Prioridade</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as ProjectPriority)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data de Início */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Data de Início</label>
              <input
                type="date"
                value={typeof formData.startDate === 'string' ? formData.startDate : ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Data de Entrega */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Data de Entrega
              </label>
              <input
                type="date"
                value={typeof formData.dueDate === 'string' ? formData.dueDate : ''}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Orçamento */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Orçamento (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* ================ ESPECIFICAÇÕES TÉCNICAS ================ */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Especificações Técnicas</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Formato */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Formato</label>
                <select
                  value={formData.specifications?.format || ''}
                  onChange={(e) => handleSpecificationChange('format', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="A4">A4 (21x29,7cm)</option>
                  <option value="A5">A5 (14,8x21cm)</option>
                  <option value="16x23">16x23cm</option>
                  <option value="20x28">20x28cm</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {/* Páginas */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Páginas</label>
                <input
                  type="number"
                  min="1"
                  value={formData.specifications?.pages || ''}
                  onChange={(e) =>
                    handleSpecificationChange('pages', parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 200"
                />
              </div>

              {/* Tiragem */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tiragem</label>
                <input
                  type="number"
                  min="1"
                  value={formData.specifications?.copies || ''}
                  onChange={(e) =>
                    handleSpecificationChange('copies', parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 1000"
                />
              </div>

              {/* Papel */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Papel</label>
                <select
                  value={formData.specifications?.paperType || ''}
                  onChange={(e) => handleSpecificationChange('paperType', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="Offset 75g">Offset 75g</option>
                  <option value="Offset 90g">Offset 90g</option>
                  <option value="Couchê 115g">Couchê 115g</option>
                  <option value="Couchê 150g">Couchê 150g</option>
                  <option value="Pólen 90g">Pólen 90g</option>
                </select>
              </div>

              {/* Cores */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Cores</label>
                <select
                  value={formData.specifications?.colors || ''}
                  onChange={(e) => handleSpecificationChange('colors', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="4x4">4x4 (Colorido frente e verso)</option>
                  <option value="4x0">4x0 (Colorido só frente)</option>
                  <option value="1x1">1x1 (PB frente e verso)</option>
                  <option value="1x0">1x0 (PB só frente)</option>
                </select>
              </div>

              {/* Acabamento */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Acabamento</label>
                <select
                  value={formData.specifications?.binding || ''}
                  onChange={(e) => handleSpecificationChange('binding', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="Brochura">Brochura</option>
                  <option value="Lombada quadrada">Lombada quadrada</option>
                  <option value="Espiral">Espiral</option>
                  <option value="Wire-o">Wire-o</option>
                  <option value="Capa dura">Capa dura</option>
                </select>
              </div>
            </div>

            {/* Requisitos Especiais */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Requisitos Especiais
              </label>
              <textarea
                value={formData.specifications?.specialRequirements || ''}
                onChange={(e) => handleSpecificationChange('specialRequirements', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva requisitos especiais, acabamentos adicionais, etc."
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Observações gerais sobre o projeto..."
            />
          </div>

          {/* ================ BOTÕES ================ */}
          <div className="flex justify-end space-x-4 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-600 transition-colors hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : project ? 'Atualizar' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
