// src/components/production/modals/ProjectModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Project, ProjectModalProps } from "@/lib/types/projects";
import { Timestamp } from "firebase/firestore";

export function ProjectModal({
  isOpen,
  onClose,
  project,
  clientId,
  quoteId,
  onSave,
  loading,
}: ProjectModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    category: "book",
    status: "open",
    priority: "medium",
    budget: 0,
    assignedTo: [],
    proofsCount: 0,
    clientApprovalTasks: [],
    tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 30); // Prazo padrão: 30 dias

      setFormData({
        title: "",
        description: "",
        category: "book",
        status: "open",
        priority: "medium",
        dueDate: Timestamp.fromDate(tomorrow),
        budget: 0,
        assignedTo: [],
        proofsCount: 0,
        clientApprovalTasks: [],
        tags: [],
        clientId,
        quoteId,
      });
    }
  }, [project, clientId, quoteId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.clientId) {
      newErrors.clientId = "Cliente é obrigatório";
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = "Budget não pode ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSave(formData as Project);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? "Editar Projeto" : "Novo Projeto"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título *
            </label>
            <Input
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={errors.title}
              placeholder="Nome do projeto"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Categoria
            </label>
            <Select
              value={formData.category}
              onChange={(value) => handleInputChange("category", value)}
              options={[
                { value: "book", label: "Livro" },
                { value: "magazine", label: "Revista" },
                { value: "catalog", label: "Catálogo" },
                { value: "brochure", label: "Folder" },
                { value: "other", label: "Outros" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              options={[
                { value: "open", label: "Aberto" },
                { value: "design", label: "Design" },
                { value: "review", label: "Revisão" },
                { value: "production", label: "Produção" },
                { value: "shipped", label: "Enviado" },
                { value: "done", label: "Concluído" },
                { value: "cancelled", label: "Cancelado" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Prioridade
            </label>
            <Select
              value={formData.priority}
              onChange={(value) => handleInputChange("priority", value)}
              options={[
                { value: "low", label: "Baixa" },
                { value: "medium", label: "Média" },
                { value: "high", label: "Alta" },
                { value: "urgent", label: "Urgente" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data de Entrega
            </label>
            <Input
              type="date"
              value={
                formData.dueDate
                  ? new Date(formData.dueDate.toMillis())
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleInputChange(
                  "dueDate",
                  Timestamp.fromDate(new Date(e.target.value))
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Budget (R$)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.budget || ""}
              onChange={(e) =>
                handleInputChange("budget", parseFloat(e.target.value) || 0)
              }
              error={errors.budget}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descrição
          </label>
          <Textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Descreva o projeto..."
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            {project ? "Salvar Alterações" : "Criar Projeto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
