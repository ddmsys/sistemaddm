'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  BookFormData,
  BookType,
  COLOR_OPTIONS,
  FINISHING_TYPES,
  FORMAT_TYPES,
  PAPER_TYPES,
  PRODUCT_TYPE_LABELS,
} from '@/lib/types/books';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookFormData) => void;
  initialData?: BookFormData;
  title?: string;
}

export default function BookModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = 'Novo Produto',
}: BookModalProps) {
  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    bookType: 'L',
    category: '',
    basePrice: 0,
    baseCost: 0,
    description: '',
    notes: '',
    paperType: '',
    finishing: '',
    format: '',
    colors: '',
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preenche formulário quando há dados iniciais
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form
      setFormData({
        name: '',
        bookType: 'L',
        category: '',
        basePrice: 0,
        baseCost: 0,
        description: '',
        notes: '',
        paperType: '',
        finishing: '',
        format: '',
        colors: '',
        tags: [],
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.basePrice || formData.basePrice <= 0) {
      newErrors.basePrice = 'Preço base deve ser maior que zero';
    }

    // Se for Livro, valida campos específicos
    if (formData.bookType === 'L') {
      if (!formData.paperType) {
        newErrors.paperType = 'Papel é obrigatório para livros';
      }
      if (!formData.finishing) {
        newErrors.finishing = 'Acabamento é obrigatório para livros';
      }
      if (!formData.format) {
        newErrors.format = 'Formato é obrigatório para livros';
      }
      if (!formData.colors) {
        newErrors.colors = 'Cores é obrigatório para livros';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleBookTypeChange = (type: BookType) => {
    setFormData({
      ...formData,
      bookType: type,
      // Limpa campos específicos ao mudar de tipo
      paperType: '',
      finishing: '',
      format: '',
      colors: '',
      description: '',
    });
  };

  if (!isOpen) return null;

  const isBookType = formData.bookType === 'L';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Nome do Produto */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Livro Infantil A4"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Tipo e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tipo *</label>
              <select
                value={formData.bookType}
                onChange={(e) => handleBookTypeChange(e.target.value as BookType)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(PRODUCT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: livro-infantil"
              />
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS PARA LIVROS */}
          {isBookType && (
            <div className="space-y-4 rounded-lg bg-blue-50 p-4">
              <h3 className="font-medium text-gray-900">Especificações do Livro</h3>

              {/* Papel */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Papel *</label>
                <select
                  value={formData.paperType || ''}
                  onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                  className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.paperType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o papel</option>
                  {PAPER_TYPES.map((paper) => (
                    <option key={paper} value={paper}>
                      {paper}
                    </option>
                  ))}
                </select>
                {errors.paperType && (
                  <p className="mt-1 text-sm text-red-500">{errors.paperType}</p>
                )}
              </div>

              {/* Acabamento */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Acabamento *</label>
                <select
                  value={formData.finishing || ''}
                  onChange={(e) => setFormData({ ...formData, finishing: e.target.value })}
                  className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.finishing ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o acabamento</option>
                  {FINISHING_TYPES.map((finish) => (
                    <option key={finish} value={finish}>
                      {finish}
                    </option>
                  ))}
                </select>
                {errors.finishing && (
                  <p className="mt-1 text-sm text-red-500">{errors.finishing}</p>
                )}
              </div>

              {/* Formato */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Formato *</label>
                <select
                  value={formData.format || ''}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.format ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o formato</option>
                  {FORMAT_TYPES.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
                {errors.format && <p className="mt-1 text-sm text-red-500">{errors.format}</p>}
              </div>

              {/* Cores */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cores *</label>
                <select
                  value={formData.colors || ''}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.colors ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione as cores</option>
                  {COLOR_OPTIONS.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                {errors.colors && <p className="mt-1 text-sm text-red-500">{errors.colors}</p>}
              </div>
            </div>
          )}

          {/* CAMPOS GENÉRICOS (OUTROS TIPOS) */}
          {!isBookType && (
            <div className="rounded-lg bg-gray-50 p-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva as especificações do produto..."
              />
            </div>
          )}

          {/* Preços */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Preço Base (Venda) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                }
                className={`w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                  errors.basePrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.basePrice && <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Custo Base (Produção)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.baseCost || 0}
                onChange={(e) =>
                  setFormData({ ...formData, baseCost: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
