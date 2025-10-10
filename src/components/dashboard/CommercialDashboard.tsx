// src/components/dashboard/CommercialDashboard.tsx
'use client';

import { DollarSign, FileText, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { DonutChart } from '@/components/comercial/charts/DonutChart';
import { FunnelChart } from '@/components/comercial/charts/FunnelChart';
import { RevenueChart } from '@/components/comercial/charts/RevenueChart';
import { ClientModal } from '@/components/comercial/modals/ClientModal';
import { LeadModal } from '@/components/comercial/modals/LeadModal';
import ProjectModal from '@/components/comercial/modals/ProjectModal';
import QuoteModal from '@/components/comercial/modals/QuoteModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useClients } from '@/hooks/comercial/useClients';
import { useCommercialMetrics } from '@/hooks/comercial/useCommercialMetrics';
import { useLeads } from '@/hooks/comercial/useLeads';
import { useProjects } from '@/hooks/comercial/useProjects';
import { useQuotes } from '@/hooks/comercial/useQuotes';
import { Lead } from '@/lib/types/leads';
import { formatCurrency } from '@/lib/utils';

export default function CommercialDashboard() {
  const router = useRouter();

  // Estados para controlar modais
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Estados para entidades selecionadas
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Hooks para operações CRUD
  const { createLead } = useLeads();
  const { clients, createClient } = useClients();
  const { createProject } = useProjects();
  const { createQuote } = useQuotes();

  // Usar o hook de métricas ao invés de dados mock
  const { metrics, loading } = useCommercialMetrics();

  // Dados mock para usuários (pode ser substituído por hook real)
  const users = [
    { id: '1', name: 'Admin' },
    { id: '2', name: 'Vendedor 1' },
    { id: '3', name: 'Vendedor 2' },
  ]; // Funções de criação de entidades
  const handleCreateLead = () => {
    setSelectedLead(null);
    setShowLeadModal(true);
  };

  const handleCreateClient = () => {
    setShowClientModal(true);
  };

  const handleCreateProject = () => {
    setShowProjectModal(true);
  };

  const handleCreateQuote = () => {
    setShowQuoteModal(true);
  };

  // Funções de navegação
  const handleNavigateToLeads = () => {
    router.push('/crm/leads');
  };

  const handleNavigateToClients = () => {
    router.push('/crm/clients');
  };

  const handleNavigateToProjects = () => {
    router.push('/crm/projects');
  };

  const handleNavigateToQuotes = () => {
    router.push('/crm/quotes');
  };

  // Funções de fechamento de modais
  const handleCloseLeadModal = () => {
    setShowLeadModal(false);
    setSelectedLead(null);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
  };

  const handleCloseQuoteModal = () => {
    setShowQuoteModal(false);
  };

  // Funções de salvamento
  const handleSaveLead = async (leadData: any) => {
    try {
      await createLead(leadData);
      setShowLeadModal(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
    }
  };

  const handleSaveClient = async (clientData: any) => {
    try {
      await createClient(clientData);
      setShowClientModal(false);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      await createProject(projectData);
      setShowProjectModal(false);
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  const handleSaveQuote = async (quoteData: any) => {
    try {
      await createQuote(quoteData);
      setShowQuoteModal(false);
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Comercial</h1>
          <p className="text-gray-600">Acompanhe suas métricas comerciais</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleCreateQuote}>
            Novo Orçamento
          </Button>
          <Button variant="outline" onClick={handleCreateProject}>
            Novo Projeto
          </Button>
          <Button variant="outline" onClick={handleCreateClient}>
            Novo Cliente
          </Button>
          <Button onClick={handleCreateLead}>Novo Lead</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(metrics?.monthlyRevenue || 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Leads</p>
              <p className="text-3xl font-bold text-gray-900">{metrics?.activeLeads || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orçamentos</p>
              <p className="text-3xl font-bold text-gray-900">{metrics?.totalQuotes || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
              <p className="text-3xl font-bold text-gray-900">{metrics?.conversionRate || 0}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Receita Mensal</h3>
          <RevenueChart data={metrics?.revenueData || []} />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Funil de Vendas</h3>
          <FunnelChart data={metrics?.funnelData || []} />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Leads por Fonte</h3>
          <DonutChart data={metrics?.leadsBySource || []} />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Orçamentos por Status</h3>
          <DonutChart data={metrics?.quotesbyStatus || []} />
        </Card>
      </div>

      {/* Ações Rápidas e Atividades */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ações Rápidas */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Ações Rápidas</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNavigateToLeads}
            >
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Leads
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNavigateToQuotes}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Orçamentos
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNavigateToProjects}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Acompanhar Projetos
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNavigateToClients}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Base de Clientes
            </Button>
          </div>
        </Card>

        {/* Atividades Recentes */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Atividades Recentes</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">Lead convertido</p>
                <p className="text-xs text-gray-500">Ana Silva - há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium">Novo orçamento enviado</p>
                <p className="text-xs text-gray-500">Projeto Livro XYZ - há 4 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-orange-500"></div>
              <div>
                <p className="text-sm font-medium">Lead qualificado</p>
                <p className="text-xs text-gray-500">João Santos - há 6 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-purple-500"></div>
              <div>
                <p className="text-sm font-medium">Projeto iniciado</p>
                <p className="text-xs text-gray-500">Editora ABC - ontem</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Projetos Críticos */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Projetos Críticos</h3>
          {metrics?.criticalProjects && metrics.criticalProjects.length > 0 ? (
            <div className="space-y-4">
              {metrics.criticalProjects.map((project) => (
                <div key={project.id} className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="font-medium text-red-900">{project.title}</p>
                  <p className="text-sm text-red-700">{project.clientName}</p>
                  <p className="text-xs text-red-600">Vence em {project.daysToDeadline} dias</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhum projeto crítico no momento</p>
          )}
        </Card>
      </div>

      {/* Modais */}
      {showLeadModal && (
        <LeadModal
          isOpen={showLeadModal}
          onClose={handleCloseLeadModal}
          onSubmit={handleSaveLead}
          lead={selectedLead}
        />
      )}

      {showClientModal && (
        <ClientModal
          isOpen={showClientModal}
          onClose={handleCloseClientModal}
          onSubmit={handleSaveClient}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          isOpen={showProjectModal}
          onClose={handleCloseProjectModal}
          onSubmit={handleSaveProject}
          clients={(clients || []) as any}
          users={users}
        />
      )}

      {showQuoteModal && (
        <QuoteModal
          isOpen={showQuoteModal}
          onClose={handleCloseQuoteModal}
          onSubmit={handleSaveQuote}
          clients={(clients || []) as any}
        />
      )}
    </div>
  );
}
