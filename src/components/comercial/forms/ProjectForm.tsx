// src/components/comercial/forms/ProjectForm.tsx
'use client';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectFormData } from '@/lib/types/projects';

interface ProjectFormProps {
  project?: ProjectFormData | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      clientId: project?.clientId || '',
      quoteId: project?.quoteId || '',
      category: project?.category || 'editorial',
      priority: project?.priority || 'medium',
      budget: project?.budget || 0,
      deadline: project?.deadline
        ? project.deadline instanceof Date
          ? project.deadline.toISOString().split('T')[0]
          : project.deadline.split('T')[0]
        : '',
      status: project?.status || 'draft',
      notes: project?.notes || '',
    },
  });

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            label="Título do Projeto *"
            {...register('title', { required: 'Título é obrigatório' })}
            error={errors.title?.message}
            placeholder="Ex: Livro de receitas da vovó"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição detalhada do projeto..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Categoria *</label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Categoria é obrigatória' }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                <option value="editorial">Editorial</option>
                <option value="grafico">Gráfico</option>
                <option value="digital">Digital</option>
                <option value="consultoria">Consultoria</option>
                <option value="outros">Outros</option>
              </select>
            )}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Prioridade *</label>
          <Controller
            name="priority"
            control={control}
            rules={{ required: 'Prioridade é obrigatória' }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma prioridade</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            )}
          />
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Orçamento"
            type="number"
            step="0.01"
            min="0"
            {...register('budget', { valueAsNumber: true })}
            error={errors.budget?.message}
            placeholder="0.00"
          />
        </div>

        <div>
          <Input
            label="Prazo"
            type="date"
            {...register('deadline')}
            error={errors.deadline?.message}
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Observações internas sobre o projeto..."
        />
        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
          )}
          {project ? 'Salvar Alterações' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  );
}
