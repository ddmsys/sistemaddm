"use client";

import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Project, ProjectFormData, Client, ProjectType, ProjectStatus, ProjectPriority } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  project?: Project | null;
  clients: Client[];
  users?: { id: string; name: string; }[];
}

const projectTypes = [
  { value: 'livro_fisico', label: 'Livro Físico' },
  { value: 'ebook', label: 'E-book' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'revista', label: 'Revista' },
  { value: 'catalogo', label: 'Catálogo' },
  { value: 'material_promocional', label: 'Material Promocional' },
  { value: 'outros', label: 'Outros' },
];

const priorities = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

export function ProjectModal({ isOpen, onClose, onSubmit, project, clients, users = [] }: ProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: project?.title || '',
    description: project?.description || '',
    client_id: project?.client_id || '',
    type: project?.type || 'livro_fisico',
    priority: project?.priority || 'medium',
    start_date: project?.start_date 
      ? (project.start_date as any).seconds 
        ? new Date(project.start_date.seconds * 1000).toISOString().split('T')[0]
        : new Date(project.start_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    due_date: project?.due_date 
      ? (project.due_date as any).seconds 
        ? new Date(project.due_date.seconds * 1000).toISOString().split('T')[0]
        : new Date(project.due_date).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: project?.budget || 0,
    team_members: project?.team_members || [],
    project_manager: project?.project_manager || '',
    specifications: {
      format: project?.specifications?.format || '',
      pages: project?.specifications?.pages || undefined,
      copies: project?.specifications?.copies || undefined,
      paper_type: project?.specifications?.paper_type || '',
      binding: project?.specifications?.binding || '',
      colors: project?.specifications?.colors || '',
      finishing: project?.specifications?.finishing || [],
      special_requirements: project?.specifications?.special_requirements || '',
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSpecs, setShowSpecs] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.client_id) newErrors.client_id = 'Cliente é obrigatório';
    if (!formData.project_manager && users.length > 0) newErrors.project_manager = 'Gerente é obrigatório';
    if (formData.budget <= 0) newErrors.budget = 'Orçamento deve ser maior que zero';
    
    const startDate = new Date(formData.start_date);
    const dueDate = new Date(formData.due_date);
    if (dueDate <= startDate) {
      newErrors.due_date = 'Data de entrega deve ser posterior à data de início';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const validationErrors = validateForm();
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      await onSubmit(formData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        client_id: '',
        type: 'livro_fisico',
        priority: 'medium',
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: 0,
        team_members: [],
        project_manager: '',
        specifications: {
          format: '',
          pages: undefined,
          copies: undefined,
          paper_type: '',
          binding: '',
          colors: '',
          finishing: [],
          special_requirements: '',
        },
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      setErrors({ general: 'Erro ao salvar projeto. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-primary-900">
            {project ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          <button
            onClick={handleClose}
            className="text-primary-400 hover:text-primary-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {/* Dados Básicos */}
            <div>
              <h3 className="text-lg font-medium text-primary-900 mb-4">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Título do Projeto *
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({...formData, title: e.target.value});
                      if (errors.title) setErrors({...errors, title: ''});
                    }}
                    placeholder="Nome do projeto"
                  />
                  {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.client_id}
                    onChange={(e) => {
                      setFormData({...formData, client_id: e.target.value});
                      if (errors.client_id) setErrors({...errors, client_id: ''});
                    }}
                  >
                    <option value="">Selecione o cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {errors.client_id && <p className="text-sm text-red-600 mt-1">{errors.client_id}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição detalhada do projeto..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Tipo de Projeto
                  </label>
                  <select
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as ProjectType})}
                  >
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as ProjectPriority})}
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Orçamento *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.budget}
                    onChange={(e) => {
                      setFormData({...formData, budget: parseFloat(e.target.value) || 0});
                      if (errors.budget) setErrors({...errors, budget: ''});
                    }}
                    placeholder="0.00"
                  />
                  {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Data de Início
                  </label>
                  <input
                    type="date"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.due_date}
                    onChange={(e) => {
                      setFormData({...formData, due_date: e.target.value});
                      if (errors.due_date) setErrors({...errors, due_date: ''});
                    }}
                  />
                  {errors.due_date && <p className="text-sm text-red-600 mt-1">{errors.due_date}</p>}
                </div>
              </div>

              {users.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Gerente do Projeto *
                  </label>
                  <select
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.project_manager}
                    onChange={(e) => {
                      setFormData({...formData, project_manager: e.target.value});
                      if (errors.project_manager) setErrors({...errors, project_manager: ''});
                    }}
                  >
                    <option value="">Selecione o gerente</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.project_manager && <p className="text-sm text-red-600 mt-1">{errors.project_manager}</p>}
                </div>
              )}
            </div>

            {/* Especificações Técnicas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-primary-900">Especificações Técnicas</h3>
                <button
                  type="button"
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                >
