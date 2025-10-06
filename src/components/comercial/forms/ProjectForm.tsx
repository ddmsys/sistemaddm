// src/components/comercial/forms/ProjectForm.tsx
'use client';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Project } from '@/lib/types/comercial';
import { PRODUCT_TYPE_LABELS } from '@/lib/types/shared';

// ================ INTERFACES ================

interface ProjectFormData {
  clientId: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: string; // ProductType como string
  priority: string;
  dueDate: string;
  budget: number;
  assignedTo?: string;
  notes?: string;
}

interface ProjectFormProps {
  project?: Project;
  quoteId?: string;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// ================ TEMPLATES FIXOS ================
const projectTemplates = [
  {
    id: 'livro',
    name: 'Livro',
    productType: 'L',
    description: 'Projeto de livro completo',
    defaultBudget: 5000,
    estimatedDays: 60,
  },
  {
    id: 'ebook',
    name: 'E-book',
    productType: 'E',
    description: 'Livro digital',
    defaultBudget: 1500,
    estimatedDays: 30,
  },
  {
    id: 'kindle',
    name: 'Kindle (ePub)',
    productType: 'K',
    description: 'Formatação para Kindle',
    defaultBudget: 800,
    estimatedDays: 15,
  },
  {
    id: 'cd',
    name: 'CD',
    productType: 'C',
    description: 'Produção de CD',
    defaultBudget: 2000,
    estimatedDays: 45,
  },
  {
    id: 'material_grafico',
    name: 'Material Gráfico',
    productType: 'G',
    description: 'Design gráfico diverso',
    defaultBudget: 1200,
    estimatedDays: 20,
  },
];

export function ProjectForm({
  project,
  quoteId,
  onSubmit,
  onCancel,
  loading = false,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      clientId: project?.clientId || '',
      quoteId: quoteId || project?.quoteId || '',
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category || 'L',
      priority: project?.priority || 'medium',
      dueDate: project?.dueDate
        ? project.dueDate.toDate().toISOString().split('T')[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: project?.budget || 0,
      assignedTo: project?.assignedTo || '',
      notes: project?.notes || '',
    },
  });

  const selectedCategory = watch('category');
  const selectedTemplate = projectTemplates.find((t) => t.productType === selectedCategory);

  // ================ OPTIONS ================

  const categoryOptions = Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => ({
    value,
    label: `${label} (${value})`,
  }));

  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' },
  ];

  // ================ HANDLERS ================

  const handleTemplateSelect = (templateId: string) => {
    const template = projectTemplates.find((t) => t.id === templateId);
    if (template) {
      setValue('category', template.productType);
      setValue('budget', template.defaultBudget);

      // Calcular data estimada
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + template.estimatedDays);
      setValue('dueDate', estimatedDate.toISOString().split('T')[0]);

      if (!watch('title')) {
        setValue('title', `Projeto ${template.name}`);
      }
    }
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* ================ TEMPLATES RÁPIDOS ================ */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Templates Rápidos</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {projectTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.id)}
                className={`rounded-lg border p-4 text-left transition-colors hover:bg-blue-50 ${
                  selectedCategory === template.productType
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-gray-900">{template.name}</div>
                <div className="mt-1 text-sm text-gray-600">{template.description}</div>
                <div className="mt-2 text-sm font-medium text-blue-600">
                  R$ {template.defaultBudget.toLocaleString('pt-BR')}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ================ INFORMAÇÕES BÁSICAS ================ */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Informações do Projeto</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Título"
              error={errors.title?.message}
              {...register('title', { required: 'Título é obrigatório' })}
            />

            <Select
              label="Categoria"
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category', { required: 'Categoria é obrigatória' })}
            />

            <Select
              label="Prioridade"
              options={priorityOptions}
              error={errors.priority?.message}
              {...register('priority', {
                required: 'Prioridade é obrigatória',
              })}
            />

            <Input
              label="Prazo de Entrega"
              type="date"
              error={errors.dueDate?.message}
              {...register('dueDate', { required: 'Prazo é obrigatório' })}
            />

            <Input
              label="Orçamento (R$)"
              type="number"
              step="0.01"
              error={errors.budget?.message}
              {...register('budget', {
                required: 'Orçamento é obrigatório',
                min: { value: 0, message: 'Orçamento deve ser positivo' },
              })}
            />

            <Input
              label="Responsável"
              error={errors.assignedTo?.message}
              {...register('assignedTo')}
            />
          </div>

          <Input
            label="Descrição"
            error={errors.description?.message}
            {...register('description')}
          />
        </CardContent>
      </Card>

      {/* ================ PREVIEW DO TEMPLATE ================ */}
      {selectedTemplate && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <h4 className="text-md font-semibold">Informações do Template</h4>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div>
                <span className="font-medium text-blue-800">Tipo:</span>
                <span className="ml-2 text-blue-900">{selectedTemplate.name}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Estimativa:</span>
                <span className="ml-2 text-blue-900">{selectedTemplate.estimatedDays} dias</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Orçamento base:</span>
                <span className="ml-2 text-blue-900">
                  R$ {selectedTemplate.defaultBudget.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================ OBSERVAÇÕES ================ */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Observações</h3>
        </CardHeader>
        <CardContent>
          <textarea
            className="h-24 w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Observações adicionais sobre o projeto..."
            {...register('notes')}
          />
        </CardContent>
      </Card>

      {/* ================ BOTÕES ================ */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button type="submit" loading={loading}>
          {project ? 'Atualizar' : 'Criar'} Projeto
        </Button>
      </div>
    </form>
  );
}
