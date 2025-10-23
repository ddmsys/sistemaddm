"use client";

import { AlertCircle, Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProjectCatalogType } from "@/lib/types/books";
import type {
  Budget,
  BudgetFormData,
  BudgetItem,
  EditorialServiceItem,
  ExtraItem,
  PrintingItem,
} from "@/lib/types/budgets";
import type { Client } from "@/lib/types/clients";
import type { Lead } from "@/lib/types/leads";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  budget?: Budget | null;
  leads?: Lead[];
  clients?: Client[];
  mode?: "create" | "edit";
}

// VALORES EXATOS DOS ENUMS CONFORME DOCUMENTAÇÃO
const EDITORIAL_SERVICES = [
  { value: "Revisão", label: "Revisão" },
  { value: "Preparação", label: "Preparação" },
  { value: "Copidesque", label: "Copidesque" },
  { value: "Criação do projeto gráfico", label: "Criação do projeto gráfico" },
  { value: "Diagramação", label: "Diagramação" },
  { value: "Capa", label: "Capa" },
  { value: "Formatação eBook", label: "Formatação eBook" },
  { value: "Conversão Kindle", label: "Conversão Kindle" },
  { value: "ISBN", label: "ISBN" },
  { value: "Ficha Catalográfica", label: "Ficha Catalográfica" },
  { value: "Impressão", label: "Impressão" },
  { value: "Divulgação Rede Sociais", label: "Divulgação Rede Sociais" },
  { value: "Campanha de Marketing", label: "Campanha de Marketing" },
  { value: "Personalizado", label: "Personalizado" },
] as const;

const EXTRA_TYPES = [
  { value: "Provas", label: "Provas" },
  { value: "Frete", label: "Frete" },
  { value: "Personalizado", label: "Personalizado" },
] as const;

// Tipos de projeto alinhados com ProjectCatalogType
const PROJECT_TYPES = [
  { value: "L", label: "Livro" },
  { value: "E", label: "E-book" },
  { value: "K", label: "Kindle" },
  { value: "C", label: "CD" },
  { value: "D", label: "DVD" },
  { value: "G", label: "Gráfica/Impressão" },
  { value: "P", label: "Plataforma" },
  { value: "S", label: "Single" },
  { value: "X", label: "Livro Terceiros" },
  { value: "A", label: "Arte/Design" },
  { value: "CUSTOM", label: "Customizado" },
] as const;

const PAYMENT_METHODS = [
  "PIX",
  "Transferência Bancária",
  "Boleto",
  "Cartão de Crédito",
  "Parcelado",
];

export function BudgetModal({
  isOpen,
  onClose,
  onSubmit,
  budget = null,
  leads = [],
  clients = [],
  mode = "create",
}: BudgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Entity Selection
  const [entityType, setEntityType] = useState<"lead" | "client">("lead");
  const [leadId, setLeadId] = useState("");
  const [clientId, setClientId] = useState("");

  // Project Type and Data
  const [projectType, setProjectType] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectSubtitle, setProjectSubtitle] = useState("");
  const [projectAuthor, setProjectAuthor] = useState("");
  const [projectPages, setProjectPages] = useState(0);

  // Items
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [currentItemType, setCurrentItemType] = useState<
    "editorial_service" | "printing" | "extra"
  >("editorial_service");

  // Editorial Service Form
  const [editorialService, setEditorialService] = useState("Revisão");
  const [customService, setCustomService] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [serviceUnitPrice, setServiceUnitPrice] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState(0);

  // Printing Form
  const [printRun, setPrintRun] = useState(100);
  const [printingUnitPrice, setPrintingUnitPrice] = useState(0);
  const [productionDays, setProductionDays] = useState(15);

  // Extra Form
  const [extraType, setExtraType] = useState("Provas");
  const [customExtra, setCustomExtra] = useState("");
  const [extraDescription, setExtraDescription] = useState("");
  const [extraQuantity, setExtraQuantity] = useState(1);
  const [extraUnitPrice, setExtraUnitPrice] = useState(0);

  // Commercial Conditions
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["PIX"]);
  const [validityDays, setValidityDays] = useState(30);
  const [clientProvidedMaterial, setClientProvidedMaterial] = useState(false);
  const [materialDescription, setMaterialDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [notes, setNotes] = useState("");

  // Load budget data when editing
  useEffect(() => {
    if (budget && mode === "edit") {
      setLeadId(budget.leadId || "");
      setClientId(budget.clientId || "");
      setEntityType(budget.leadId ? "lead" : "client");
      setProjectType(budget.projectType || "");
      setProjectTitle(budget.projectData?.title || "");
      setProjectSubtitle(budget.projectData?.subtitle || "");
      setProjectAuthor(budget.projectData?.author || "");
      setProjectPages(budget.projectData?.pages || 0);
      setItems(budget.items || []);
      setPaymentMethods(budget.paymentMethods || ["PIX"]);
      setValidityDays(budget.validityDays || 30);
      setProductionDays(budget.productionDays || 0);
      setClientProvidedMaterial(budget.clientProvidedMaterial || false);
      setMaterialDescription(budget.materialDescription || "");
      setDiscount(budget.discount || 0);
      setDiscountPercentage(budget.discountPercentage || 0);
      setNotes(budget.notes || "");
    } else {
      resetForm();
    }
  }, [budget, mode, isOpen]);

  const resetForm = () => {
    setEntityType("lead");
    setLeadId("");
    setClientId("");
    setProjectType("");
    setProjectTitle("");
    setProjectSubtitle("");
    setProjectAuthor("");
    setProjectPages(0);
    setItems([]);
    setPaymentMethods(["PIX"]);
    setValidityDays(30);
    setClientProvidedMaterial(false);
    setMaterialDescription("");
    setDiscount(0);
    setDiscountPercentage(0);
    setNotes("");
    setErrors([]);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTotal = () => {
    let total = calculateSubtotal();
    if (discountPercentage > 0) {
      total -= (total * discountPercentage) / 100;
    }
    if (discount > 0) {
      total -= discount;
    }
    return Math.max(0, total);
  };

  const generateItemId = () => {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addEditorialServiceItem = () => {
    const description =
      editorialService === "Personalizado"
        ? customService || serviceDescription
        : serviceDescription || editorialService;

    const newItem: EditorialServiceItem = {
      id: generateItemId(),
      type: "editorial_service",
      service: editorialService as any,
      customService: editorialService === "Personalizado" ? customService : undefined,
      description,
      quantity: serviceQuantity,
      unitPrice: serviceUnitPrice,
      totalPrice: serviceQuantity * serviceUnitPrice,
      estimatedDays,
      notes: "",
    };

    setItems([...items, newItem]);

    // Reset form
    setServiceDescription("");
    setServiceQuantity(1);
    setServiceUnitPrice(0);
    setEstimatedDays(0);
    setCustomService("");
  };

  const addPrintingItem = () => {
    const newItem: PrintingItem = {
      id: generateItemId(),
      type: "printing",
      description: `Impressão - Tiragem: ${printRun} unidades`,
      quantity: 1,
      unitPrice: printingUnitPrice * printRun,
      totalPrice: printingUnitPrice * printRun,
      printRun,
      useBookSpecs: false,
      productionDays,
      notes: "",
    };

    setItems([...items, newItem]);

    // Reset form
    setPrintRun(100);
    setPrintingUnitPrice(0);
    setProductionDays(15);
  };

  const addExtraItem = () => {
    const description =
      extraType === "Personalizado"
        ? customExtra || extraDescription
        : extraDescription || extraType;

    const newItem: ExtraItem = {
      id: generateItemId(),
      type: "extra",
      extraType: extraType as any,
      customExtra: extraType === "Personalizado" ? customExtra : undefined,
      description,
      quantity: extraQuantity,
      unitPrice: extraUnitPrice,
      totalPrice: extraQuantity * extraUnitPrice,
      notes: "",
    };

    setItems([...items, newItem]);

    // Reset form
    setExtraDescription("");
    setExtraQuantity(1);
    setExtraUnitPrice(0);
    setCustomExtra("");
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Entity validation
    if (entityType === "lead" && !leadId) {
      newErrors.push("Selecione um lead");
    }
    if (entityType === "client" && !clientId) {
      newErrors.push("Selecione um cliente");
    }

    // Project validation
    if (!projectType) {
      newErrors.push("Selecione o tipo de projeto");
    }
    if (!projectTitle?.trim()) {
      newErrors.push("Digite o título do projeto");
    }

    // Items validation
    if (items.length === 0) {
      newErrors.push("Adicione pelo menos um item ao orçamento");
    }

    // Payment validation
    if (paymentMethods.length === 0) {
      newErrors.push("Selecione pelo menos uma forma de pagamento");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 🔥 CORREÇÃO PRINCIPAL: Só enviar leadId OU clientId, nunca undefined
      const formData: BudgetFormData = {
        projectTitle,
        // Se for lead, envia leadId. Se for client, envia clientId
        ...(entityType === "lead" && leadId ? { leadId } : {}),
        ...(entityType === "client" && clientId ? { clientId } : {}),
        projectType: projectType as ProjectCatalogType,
        projectData: {
          title: projectTitle,
          subtitle: projectSubtitle || undefined,
          author: projectAuthor || undefined,
          pages: projectPages || undefined,
        },
        items: items.map(({ id, totalPrice, ...item }) => item) as any,
        paymentMethods,
        validityDays,
        productionDays: productionDays > 0 ? productionDays : undefined,
        clientProvidedMaterial,
        materialDescription: materialDescription.trim() || undefined,
        discount: discount > 0 ? discount : undefined,
        discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
        notes: notes.trim() || undefined,
      };

      await onSubmit(formData);
      onClose();
      resetForm();
    } catch (err) {
      console.error("Error submitting budget:", err);
      setErrors([err instanceof Error ? err.message : "Erro ao salvar orçamento"]);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method],
    );
  };

  if (!isOpen) return null;

  const selectedEntity =
    entityType === "lead"
      ? leads.find((l) => l.id === leadId)
      : clients.find((c) => c.id === clientId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "edit" ? "Editar Orçamento" : "Novo Orçamento"}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <div className="flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-medium text-red-800">Corrija os seguintes erros:</h3>
                  <ul className="mt-2 list-inside list-disc text-sm text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Cliente/Lead */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">1. Cliente ou Lead</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={entityType}
                  onValueChange={(value) => {
                    setEntityType(value as "lead" | "client");
                    setLeadId("");
                    setClientId("");
                  }}
                  disabled={loading || mode === "edit"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{entityType === "lead" ? "Lead" : "Cliente"} *</Label>
                <Select
                  value={
                    entityType === "lead"
                      ? leads.find((l) => l.id === leadId)?.name || leadId
                      : clients.find((c) => c.id === clientId)?.name || clientId
                  }
                  onValueChange={(value) => {
                    if (entityType === "lead") {
                      const selectedLead = leads.find((l) => l.name === value);
                      setLeadId(selectedLead?.id || "");
                    } else {
                      const selectedClient = clients.find((c) => c.name === value);
                      setClientId(selectedClient?.id || "");
                    }
                  }}
                  disabled={loading || mode === "edit"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {entityType === "lead" ? (
                      leads.length > 0 ? (
                        leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.name}>
                            {lead.name} {lead.company && `- ${lead.company}`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Nenhum lead disponível
                        </SelectItem>
                      )
                    ) : clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.name}>
                          {client.name} {client.company && `- ${client.company}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Nenhum cliente disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedEntity && (
              <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                <p>
                  <strong>Nome:</strong> {selectedEntity.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEntity.email}
                </p>
                {selectedEntity.phone && (
                  <p>
                    <strong>Telefone:</strong> {selectedEntity.phone}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Tipo de Projeto */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">2. Tipo de Projeto</h3>
            <div>
              <Label>Tipo *</Label>
              <Select value={projectType} onValueChange={setProjectType} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 3: Dados do Projeto */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">3. Dados do Projeto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Título *</Label>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Título do projeto"
                  disabled={loading}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Subtítulo</Label>
                <Input
                  value={projectSubtitle}
                  onChange={(e) => setProjectSubtitle(e.target.value)}
                  placeholder="Subtítulo (opcional)"
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Autor</Label>
                <Input
                  value={projectAuthor}
                  onChange={(e) => setProjectAuthor(e.target.value)}
                  placeholder="Nome do autor"
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Páginas</Label>
                <Input
                  type="number"
                  value={projectPages}
                  onChange={(e) => setProjectPages(parseInt(e.target.value) || 0)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Itens do Orçamento */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">4. Itens do Orçamento</h3>

            {/* Item Type Selector */}
            <div className="mb-4 flex gap-2 border-b">
              <button
                type="button"
                onClick={() => setCurrentItemType("editorial_service")}
                className={`px-4 py-2 font-medium transition-colors ${
                  currentItemType === "editorial_service"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Serviços Editoriais
              </button>
              <button
                type="button"
                onClick={() => setCurrentItemType("printing")}
                className={`px-4 py-2 font-medium transition-colors ${
                  currentItemType === "printing"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Impressão
              </button>
              <button
                type="button"
                onClick={() => setCurrentItemType("extra")}
                className={`px-4 py-2 font-medium transition-colors ${
                  currentItemType === "extra"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Extras
              </button>
            </div>

            {/* Editorial Service Form */}
            {currentItemType === "editorial_service" && (
              <div className="rounded-lg border p-4">
                <h4 className="mb-4 font-medium">Adicionar Serviço Editorial</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Serviço</Label>
                    <Select value={editorialService} onValueChange={setEditorialService}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EDITORIAL_SERVICES.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {editorialService === "Personalizado" && (
                    <div className="col-span-2">
                      <Label>Nome do Serviço</Label>
                      <Input
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                        placeholder="Digite o nome do serviço"
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      placeholder="Descrição detalhada do serviço"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      value={serviceQuantity}
                      onChange={(e) => setServiceQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <Label>Valor Unitário (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={serviceUnitPrice}
                      onChange={(e) => setServiceUnitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Prazo Estimado (dias)</Label>
                    <Input
                      type="number"
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Total</Label>
                    <div className="flex h-10 items-center rounded-md border bg-gray-50 px-3 font-semibold">
                      R$ {(serviceQuantity * serviceUnitPrice).toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Button type="button" onClick={addEditorialServiceItem} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Serviço
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Printing Form */}
            {currentItemType === "printing" && (
              <div className="rounded-lg border p-4">
                <h4 className="mb-4 font-medium">Adicionar Impressão</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tiragem (unidades)</Label>
                    <Input
                      type="number"
                      value={printRun}
                      onChange={(e) => setPrintRun(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <Label>Valor por Unidade (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={printingUnitPrice}
                      onChange={(e) => setPrintingUnitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Prazo de Produção (dias)</Label>
                    <Input
                      type="number"
                      value={productionDays}
                      onChange={(e) => setProductionDays(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Total</Label>
                    <div className="flex h-10 items-center rounded-md border bg-gray-50 px-3 font-semibold">
                      R$ {(printRun * printingUnitPrice).toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Button type="button" onClick={addPrintingItem} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Impressão
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Extra Form */}
            {currentItemType === "extra" && (
              <div className="rounded-lg border p-4">
                <h4 className="mb-4 font-medium">Adicionar Extra</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Tipo</Label>
                    <Select value={extraType} onValueChange={setExtraType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXTRA_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {extraType === "Personalizado" && (
                    <div className="col-span-2">
                      <Label>Nome do Extra</Label>
                      <Input
                        value={customExtra}
                        onChange={(e) => setCustomExtra(e.target.value)}
                        placeholder="Digite o nome"
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={extraDescription}
                      onChange={(e) => setExtraDescription(e.target.value)}
                      placeholder="Descrição do item extra"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      value={extraQuantity}
                      onChange={(e) => setExtraQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <Label>Valor Unitário (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={extraUnitPrice}
                      onChange={(e) => setExtraUnitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Total</Label>
                    <div className="flex h-10 items-center rounded-md border bg-gray-50 px-3 font-semibold">
                      R$ {(extraQuantity * extraUnitPrice).toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Button type="button" onClick={addExtraItem} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Extra
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Items List */}
            {items.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 font-medium">Itens Adicionados</h4>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-lg border bg-gray-50 p-4"
                    >
                      <div className="flex-1">
                        <div className="mb-1 text-xs font-medium uppercase text-gray-500">
                          {item.type === "editorial_service"
                            ? "Serviço Editorial"
                            : item.type === "printing"
                              ? "Impressão"
                              : "Extra"}
                        </div>
                        <div className="font-medium text-gray-900">{item.description}</div>
                        <div className="mt-1 flex gap-4 text-sm text-gray-600">
                          <span>Qtd: {item.quantity}</span>
                          <span>
                            Unit:{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.unitPrice)}
                          </span>
                          <span className="font-semibold">
                            Total:{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Condições Comerciais */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">5. Condições Comerciais</h3>

            <div className="space-y-4">
              <div>
                <Label>Formas de Pagamento *</Label>
                <div className="mt-2 space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={paymentMethods.includes(method)}
                        onChange={() => togglePaymentMethod(method)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Validade (dias) *</Label>
                  <Input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label>Prazo de Produção (dias)</Label>
                  <Input
                    type="number"
                    value={productionDays}
                    onChange={(e) => setProductionDays(parseInt(e.target.value) || 0)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={clientProvidedMaterial}
                    onChange={(e) => setClientProvidedMaterial(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Cliente fornecerá material</span>
                </label>

                {clientProvidedMaterial && (
                  <Textarea
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    placeholder="Descreva o material que o cliente fornecerá..."
                    rows={2}
                    disabled={loading}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Desconto (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) => {
                      setDiscount(parseFloat(e.target.value) || 0);
                      setDiscountPercentage(0);
                    }}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label>Desconto (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={discountPercentage}
                    onChange={(e) => {
                      setDiscountPercentage(parseFloat(e.target.value) || 0);
                      setDiscount(0);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações adicionais sobre o orçamento..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-3 font-semibold text-blue-900">Resumo Financeiro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(calculateSubtotal())}
                </span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Desconto ({discountPercentage}%):</span>
                  <span>
                    -
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format((calculateSubtotal() * discountPercentage) / 100)}
                  </span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Desconto:</span>
                  <span>
                    -
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-t pt-2 text-lg font-bold text-blue-900">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(calculateTotal())}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={onClose} variant="outline" disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>{mode === "edit" ? "Atualizar" : "Criar"} Orçamento</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
