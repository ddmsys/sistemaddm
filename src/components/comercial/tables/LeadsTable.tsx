'use client';

import { Edit, Eye, Trash2, UserPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Column, DataTable, TableAction } from '@/components/ui/DataTable';
import { Lead, LeadStatus } from '@/lib/types/leads';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (leadId: string) => void;
  onView?: (lead: Lead) => void;
}

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  primeiro_contato: { label: 'Primeiro Contato', color: 'bg-blue-100 text-blue-800' },
  qualificado: { label: 'Qualificado', color: 'bg-green-100 text-green-800' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'bg-purple-100 text-purple-800' },
  negociacao: { label: 'Negociação', color: 'bg-orange-100 text-orange-800' },
  fechado_ganho: { label: 'Ganhou', color: 'bg-emerald-100 text-emerald-800' },
  fechado_perdido: { label: 'Perdido', color: 'bg-red-100 text-red-800' },
};

export function LeadsTable({
  leads,
  loading,
  onEdit,
  onDelete,
  onConvert,
  onView,
}: LeadsTableProps) {
  const columns: Column<Lead>[] = [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      width: 'w-64',
    },
    {
      key: 'email',
      header: 'Email',
      render: (lead) => lead.email || <span className="text-slate-400">-</span>,
    },
    {
      key: 'company',
      header: 'Empresa',
      render: (lead) => lead.company || <span className="text-slate-400">-</span>,
    },
    {
      key: 'value',
      header: 'Valor',
      align: 'right',
      sortable: true,
      render: (lead) =>
        lead.value ? formatCurrency(lead.value) : <span className="text-slate-400">-</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (lead) => (
        <Badge className={statusConfig[lead.status].color}>{statusConfig[lead.status].label}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Criado em',
      sortable: true,
      render: (lead) => formatDate(lead.createdAt.toDate()),
    },
  ];

  const actions: TableAction<Lead>[] = [
    {
      label: 'Ver',
      icon: Eye,
      onClick: (lead) => onView?.(lead),
      variant: 'outline',
    },
    {
      label: 'Editar',
      icon: Edit,
      onClick: (lead) => onEdit?.(lead),
      variant: 'outline',
    },
    {
      label: 'Converter',
      icon: UserPlus,
      onClick: (lead) => onConvert?.(lead.id!),
      variant: 'default',
      show: (lead) => ['qualificado', 'proposta_enviada', 'negociacao'].includes(lead.status),
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: (lead) => onDelete?.(lead.id!),
      variant: 'destructive',
    },
  ];

  return (
    <DataTable
      title="Leads"
      data={leads}
      columns={columns}
      actions={actions}
      loading={loading}
      searchable={true}
      sortable={true}
      pagination={true}
      pageSize={20}
      emptyMessage="Nenhum lead encontrado"
    />
  );
}
