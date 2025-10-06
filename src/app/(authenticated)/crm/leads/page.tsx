'use client';

import { Building2, Filter, Mail, MoreHorizontal, Phone, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

import { LeadModal } from '@/components/comercial/modals/LeadModal';
import { useFirestore } from '@/hooks/useFirestore';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '@/lib/types';

interface FilterState {
  status: LeadStatus | '';
  source: LeadSource | '';
  search: string;
}

export default function LeadsPage() {
  const { data: leads, loading, create, update, remove } = useFirestore<Lead>('leads');
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    source: '',
    search: '',
  });

  const handleCreateLead = async (data: LeadFormData) => {
    try {
      if (selectedLead) {
        await update(selectedLead.id, data);
      } else {
        await create({
          ...data,
          lead_number: `LED-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          status: 'new' as LeadStatus,
          score: 0,
          tags: [],
          activities: [],
        });
      }
      setShowModal(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      throw error;
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await remove(leadId);
      } catch (error) {
        console.error('Erro ao excluir lead:', error);
      }
    }
  };

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'new', label: 'Novo' },
    { value: 'contacted', label: 'Contatado' },
    { value: 'qualified', label: 'Qualificado' },
    { value: 'proposal', label: 'Proposta' },
    { value: 'negotiation', label: 'Negociação' },
    { value: 'closed_won', label: 'Ganho' },
    { value: 'closed_lost', label: 'Perdido' },
  ];

  const sourceOptions = [
    { value: '', label: 'Todas as fontes' },
    { value: 'website', label: 'Website' },
    { value: 'social_media', label: 'Redes Sociais' },
    { value: 'referral', label: 'Indicação' },
    { value: 'advertising', label: 'Publicidade' },
    { value: 'email_marketing', label: 'Email Marketing' },
    { value: 'event', label: 'Evento' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'other', label: 'Outro' },
  ];

  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      contacted: 'bg-amber-50 text-amber-700 border-amber-200',
      qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      proposal: 'bg-purple-50 text-purple-700 border-purple-200',
      negotiation: 'bg-orange-50 text-orange-700 border-orange-200',
      closed_won: 'bg-green-50 text-green-700 border-green-200',
      closed_lost: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status];
  };

  const getStatusLabel = (status: LeadStatus) => {
    const labels = {
      new: 'Novo',
      contacted: 'Contatado',
      qualified: 'Qualificado',
      proposal: 'Proposta',
      negotiation: 'Negociação',
      closed_won: 'Ganho',
      closed_lost: 'Perdido',
    };
    return labels[status];
  };

  const displayLeads = leads.filter((lead) => {
    if (filters.status && lead.status !== filters.status) return false;
    if (filters.source && lead.source !== filters.source) return false;
    if (
      filters.search &&
      !lead.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !lead.email.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Leads</h1>
            <p className="mt-2 text-primary-600">Gerencie seus leads e oportunidades</p>
          </div>

          <button
            onClick={() => {
              setSelectedLead(null);
              setShowModal(true);
            }}
            className="mt-4 flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 sm:mt-0"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Lead
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-primary-700">
                Buscar leads
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-primary-400" />
                <input
                  type="text"
                  className="h-12 w-full rounded-lg border border-primary-200 pl-10 pr-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome, email ou empresa..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="mb-2 block text-sm font-medium text-primary-700">Status</label>
              <select
                className="h-12 w-full rounded-lg border border-primary-200 px-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as LeadStatus | '',
                  })
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-48">
              <label className="mb-2 block text-sm font-medium text-primary-700">Fonte</label>
              <select
                className="h-12 w-full rounded-lg border border-primary-200 px-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={filters.source}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    source: e.target.value as LeadSource | '',
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

            <button className="flex items-center rounded-lg border border-primary-300 px-4 py-3 text-primary-700 transition-colors hover:bg-primary-50">
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">
                {loading ? 'Carregando...' : `${displayLeads.length} leads encontrados`}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-primary-600">
                <Users className="h-4 w-4" />
                <span>Total: {leads.length}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <span className="ml-2 text-primary-600">Carregando leads...</span>
              </div>
            ) : displayLeads.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-primary-300" />
                <h3 className="mb-2 text-lg font-medium text-primary-900">
                  Nenhum lead encontrado
                </h3>
                <p className="mb-6 text-primary-600">
                  Comece criando seu primeiro lead ou ajuste os filtros.
                </p>
                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setShowModal(true);
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Criar Primeiro Lead
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`rounded-lg border p-6 transition-all hover:shadow-md ${getStatusColor(
                      lead.status,
                    )}`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary-900">{lead.name}</h3>
                          <p className="text-xs text-primary-500">{lead.lead_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-full border px-2 py-1 text-xs font-medium">
                          {getStatusLabel(lead.status)}
                        </span>
                        <div className="relative">
                          <button className="p-1 text-primary-400 hover:text-primary-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-sm text-primary-600">
                        <Mail className="mr-2 h-4 w-4" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center text-sm text-primary-600">
                          <Phone className="mr-2 h-4 w-4" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center text-sm text-primary-600">
                          <Building2 className="mr-2 h-4 w-4" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      )}
                    </div>

                    {lead.interest_area && (
                      <div className="mb-4">
                        <p className="text-sm text-primary-700">
                          <span className="font-medium">Interesse:</span> {lead.interest_area}
                        </p>
                      </div>
                    )}

                    {lead.tags && lead.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {lead.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="rounded bg-white bg-opacity-50 px-2 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {lead.tags.length > 2 && (
                          <span className="rounded bg-white bg-opacity-50 px-2 py-1 text-xs">
                            +{lead.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-white border-opacity-20 pt-4">
                      <div className="text-sm text-primary-600">
                        Score: <span className="font-medium">{lead.score || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <LeadModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedLead(null);
          }}
          onSubmit={handleCreateLead}
          lead={selectedLead}
        />
      </div>
    </div>
  );
}
