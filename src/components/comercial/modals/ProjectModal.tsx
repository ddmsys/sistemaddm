"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "@/lib/types/comercial";
import { useClients } from "@/hooks/comercial/useClients";
import { useQuotes } from "@/hooks/comercial/useQuotes";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (data: any) => Promise<void>;
  loading?: boolean;
}

export function ProjectModal({
  isOpen,
  onClose,
  project,
  onSave,
  loading = false,
}: ProjectModalProps) {
  // ✅ HOOKS PARA BUSCAR DADOS (IGUAL CLIENTE)
  const { clients } = useClients();
  const { quotes } = useQuotes();

  // ✅ FORM STATE (IGUAL CLIENTE)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    quoteId: "",
    status: "planning" as
      | "planning"
      | "in-progress"
      | "completed"
      | "cancelled",
    startDate: "",
    endDate: "",
    budget: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ POPULATE FORM WHEN EDITING (IGUAL CLIENTE)
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        clientId: project.clientId || "",
        quoteId: project.quoteId || "",
        status: (project.status as any) || "planning",
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        budget: project.budget?.toString() || "",
        notes: project.notes || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        clientId: "",
        quoteId: "",
        status: "planning",
        startDate: "",
        endDate: "",
        budget: "",
        notes: "",
      });
    }
    setErrors({});
  }, [project, isOpen]);

  // ✅ VALIDATION (IGUAL CLIENTE)
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // ✅ CAMPOS OBRIGATÓRIOS
    if (!formData.title?.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.clientId) newErrors.clientId = "Cliente é obrigatório";

    // ✅ VALIDAÇÃO DE DATAS
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = "Data de fim deve ser após data de início";
      }
    }

    // ✅ VALIDAÇÃO DE BUDGET
    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = "Valor deve ser um número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT (IGUAL CLIENTE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      // ✅ PREPARAR DADOS PARA SALVAR (IGUAL CLIENTE)
      const projectData: any = {
        title: formData.title,
        clientId: formData.clientId,
        status: formData.status,
      };

      // ✅ ADICIONAR CAMPOS SE PREENCHIDOS (IGUAL CLIENTE)
      if (formData.description?.trim())
        projectData.description = formData.description;
      if (formData.quoteId?.trim()) projectData.quoteId = formData.quoteId;
      if (formData.startDate?.trim())
        projectData.startDate = formData.startDate;
      if (formData.endDate?.trim()) projectData.endDate = formData.endDate;
      if (formData.budget?.trim()) projectData.budget = Number(formData.budget);
      if (formData.notes?.trim()) projectData.notes = formData.notes;

      await onSave(projectData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  // ✅ CLOSE HANDLER (IGUAL CLIENTE)
  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      clientId: "",
      quoteId: "",
      status: "planning",
      startDate: "",
      endDate: "",
      budget: "",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {project ? "Editar Projeto" : "Novo Projeto"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ INFORMAÇÕES BÁSICAS */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Projeto *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Desenvolvimento do Website"
                error={errors.title}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descreva o projeto detalhadamente..."
                rows={4}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* ✅ VINCULAÇÕES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientId">Cliente *</Label>
              <select
                id="clientId"
                value={formData.clientId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, clientId: e.target.value }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name || client.companyName || "Cliente sem nome"}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-sm text-red-600 mt-1">{errors.clientId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quoteId">Orçamento (Opcional)</Label>
              <select
                id="quoteId"
                value={formData.quoteId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quoteId: e.target.value }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Nenhum orçamento</option>
                {quotes.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    {quote.title || `Orçamento ${quote.number}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ STATUS E DATAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="planning">Planejamento</option>
                <option value="in-progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                error={errors.startDate}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                error={errors.endDate}
              />
            </div>
          </div>

          {/* ✅ ORÇAMENTO E NOTAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, budget: e.target.value }))
                }
                placeholder="0.00"
                error={errors.budget}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Observações internas sobre o projeto..."
              rows={3}
              className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* ✅ BUTTONS (IGUAL CLIENTE) */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Salvando...
                </div>
              ) : project ? (
                "Atualizar"
              ) : (
                "Criar Projeto"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
