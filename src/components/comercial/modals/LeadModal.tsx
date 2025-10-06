'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import { useFirestore } from '@/hooks/useFirestore';
import { Lead, LeadFormData, LeadSource } from '@/lib/types';
import { isValidEmail, maskPhone } from '@/lib/utils';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  lead?: Lead | null;
}

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'social_media', label: 'Redes Sociais' },
  { value: 'referral', label: 'Indicação' },
  { value: 'advertising', label: 'Publicidade' },
  { value: 'email_marketing', label: 'Email Marketing' },
  { value: 'event', label: 'Evento' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'other', label: 'Outro' },
];

const budgetOptions = [
  { value: 'até_5k', label: 'Até R$ 5.000' },
  { value: '5k_15k', label: 'R$ 5.000 - R$ 15.000' },
  { value: '15k_50k', label: 'R$ 15.000 - R$ 50.000' },
  { value: '50k_100k', label: 'R$ 50.000 - R$ 100.000' },
  { value: 'acima_100k', label: 'Acima de R$ 100.000' },
  { value: 'nao_definido', label: 'Não definido' },
];

export function LeadModal({ isOpen, onClose, onSubmit, lead }: LeadModalProps) {
  const { checkDuplicate } = useFirestore<Lead>('leads');

  const [formData, setFormData] = useState<LeadFormData>({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    source: lead?.source || 'website',
    interest_area: lead?.interest_area || '',
    budget_range: lead?.budget_range || '',
    message: lead?.message || '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = async (): Promise<Record<string, string>> => {
    const newErrors: Record<string, string> = {};

    // Nome obrigatório
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    // Email obrigatório e válido
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    } else {
      // Verificar duplicidade de email
      const isDuplicate = await checkDuplicate('email', formData.email, lead?.id);
      if (isDuplicate) {
        newErrors.email = 'Este email já está cadastrado';
      }
    }

    // Telefone válido se preenchido
    if (formData.phone) {
      const cleaned = formData.phone.replace(/\D/g, '');
      if (cleaned.length < 10 || cleaned.length > 11) {
        newErrors.phone = 'Telefone inválido';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationErrors = await validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await onSubmit(formData);
      onClose();

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'website',
        interest_area: '',
        budget_range: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      setErrors({ general: 'Erro ao salvar lead. Tente novamente.' });
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-primary-900">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h2>
          <button onClick={handleClose} className="p-1 text-primary-400 hover:text-primary-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Nome completo *
                </label>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="Digite o nome"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">Email *</label>
                <input
                  type="email"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">Telefone</label>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    setFormData({ ...formData, phone: masked });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">Empresa</label>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Fonte do lead
                </label>
                <select
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      source: e.target.value as LeadSource,
                    })
                  }
                >
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Faixa de orçamento
                </label>
                <select
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.budget_range}
                  onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                >
                  <option value="">Selecione a faixa</option>
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-700">
                Área de interesse
              </label>
              <input
                type="text"
                className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={formData.interest_area}
                onChange={(e) => setFormData({ ...formData, interest_area: e.target.value })}
                placeholder="Ex: Livro infantil, Romance, Biografia..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-700">
                Mensagem/Observações
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-primary-200 px-3 py-2 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Observações sobre o lead..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-primary-50 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-primary-300 px-4 py-2 text-primary-700 transition-colors hover:bg-primary-100"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            )}
            {lead ? 'Salvar Alterações' : 'Criar Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
