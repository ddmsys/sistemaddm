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
  onSave: (data: BudgetFormData) => Promise<void>;
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

const PROJECT_TYPES = [
  { value: "book", label: "Livro" },
  { value: "ebook", label: "E-book" },
  { value: "magazine", label: "Revista" },
  { value: "catalog", label: "Catálogo" },
  { value: "brochure", label: "Folder" },
  { value: "packaging", label: "Embalagem" },
  { value: "label", label: "Etiqueta" },
  { value: "card", label: "Cartão" },
  { value: "other", label: "Outro" },
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
  onSave,
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
  const [projectType, setProjectType] = useState<string>("");
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
  const [editorialService, setEditorialService] = useState<string>("Revisão");
  const [customService, setCustomService] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [serviceUnitPrice, setServiceUnitPrice] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState<number>(0);

  // Printing Form
  const [printRun, setPrintRun] = useState(100);
  const [printingUnitPrice, setPrintingUnitPrice] = useState(0);
  const [productionDays, setProductionDays] = useState(15);

  // Extra Form
  const [extraType, setExtraType] = useState<string>("Provas");
  const [customExtra, setCustomExtra] = useState("");
  const [extraDescription, setExtraDescription] = useState("");
  const [extraQuantity, setExtraQuantity] = useState(1);
  const [extraUnitPrice, setExtraUnitPrice] = useState(0);

  // Commercial Conditions
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["PIX"]);
  const [validityDays, setValidityDays] = useState(30);
  const [clientProvidedMaterial, setClientProvidedMaterial] = useState(false);
  const [materialDescription, setMaterialDescription] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
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
      setProjectPages(budget.projectData?.pages ?? 0);
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
      const formData: BudgetFormData = {
        projectTitle: projectTitle, // ✅ Campo obrigatório no root
        leadId: entityType === "lead" ? leadId : undefined,
        clientId: entityType === "client" ? clientId : undefined,
        projectType: projectType as any,
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

      await onSave(formData);
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
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "edit" ? "Editar Orçamento" : "Novo Orçamento"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100" disabled={loading}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div className="flex-1">
                  <p className="mb-2 font-medium text-red-900">Corrija os seguintes erros:</p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Cliente/Lead */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              1. Cliente ou Lead
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={entityType}
                  onValueChange={(value: string) => {
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

              <div className="space-y-2">
                <Label>{entityType === "lead" ? "Lead" : "Cliente"} *</Label>
                <Select
                  value={entityType === "lead" ? leadId : clientId}
                  onValueChange={(value) => {
                    if (entityType === "lead") {
                      setLeadId(value);
                    } else {
                      setClientId(value);
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
                          <SelectItem key={lead.id} value={lead.id!}>
                            {lead.name} {lead.company && `- ${lead.company}`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-leads" disabled>
                          Nenhum lead disponível
                        </SelectItem>
                      )
                    ) : clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id!}>
                          {client.name} {client.company && `- ${client.company}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-clients" disabled>
                        Nenhum cliente disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedEntity && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Email:</strong> {selectedEntity.email}
                  {selectedEntity.phone && (
                    <>
                      <br />
                      <strong>Telefone:</strong> {selectedEntity.phone}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Tipo de Projeto */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              2. Tipo de Projeto
            </h3>

            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={projectType} onValueChange={setProjectType} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de projeto" />
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
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              3. Dados do Projeto
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Título do projeto"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={projectSubtitle}
                  onChange={(e) => setProjectSubtitle(e.target.value)}
                  placeholder="Subtítulo (opcional)"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Autor</Label>
                <Input
                  value={projectAuthor}
                  onChange={(e) => setProjectAuthor(e.target.value)}
                  placeholder="Nome do autor"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Páginas</Label>
                <Input
                  type="number"
                  min="0"
                  value={projectPages}
                  onChange={(e) => setProjectPages(parseInt(e.target.value) || 0)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Itens do Orçamento */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              4. Itens do Orçamento
            </h3>

            {/* Item Type Selector */}
            <div className="flex gap-2 border-b">
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
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900">Adicionar Serviço Editorial</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label>Nome do Serviço</Label>
                      <Input
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                        placeholder="Digite o nome do serviço"
                      />
                    </div>
                  )}

                  <div className="col-span-2 space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      placeholder="Descrição detalhada do serviço"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={serviceQuantity}
                      onChange={(e) => setServiceQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Unitário (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={serviceUnitPrice}
                      onChange={(e) => setServiceUnitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prazo Estimado (dias)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total</Label>
                    <Input
                      type="text"
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(serviceQuantity * serviceUnitPrice)}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addEditorialServiceItem}
                  variant="outline"
                  className="w-full"
                  disabled={
                    serviceUnitPrice === 0 ||
                    (editorialService === "Personalizado" && !customService.trim())
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Serviço
                </Button>
              </div>
            )}

            {/* Printing Form */}
            {currentItemType === "printing" && (
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900">Adicionar Impressão</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tiragem (unidades)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={printRun}
                      onChange={(e) => setPrintRun(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor por Unidade (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={printingUnitPrice}
                      onChange={(e) => setPrintingUnitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prazo de Produção (dias)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={productionDays}
                      onChange={(e) => setProductionDays(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total</Label>
                    <Input
                      type="text"
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(printRun * printingUnitPrice)}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addPrintingItem}
                  variant="outline"
                  className="w-full"
                  disabled={printingUnitPrice === 0 || printRun === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Impressão
                </Button>
              </div>
            )}

            {/* Extra Form */}
            {currentItemType === "extra" && (
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900">Adicionar Extra</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label>Nome do Extra</Label>
                      <Input
                        value={customExtra}
                        onChange={(e) => setCustomExtra(e.target.value)}
                        placeholder="Digite o nome"
                      />
                    </div>
                  )}

                  <div className="col-span-2 space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={extraDescription}
                      onChange={(e) => setExtraDescription(e.target.value)}
                      placeholder="Descrição do item extra"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={extraQuantity}
                      onChange={(e) => setExtraQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Unitário (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={extraUnitPrice}
                      onChange={(e) => setExtraUnitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Total</Label>
                    <Input
                      type="text"
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(extraQuantity * extraUnitPrice)}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addExtraItem}
                  variant="outline"
                  className="w-full"
                  disabled={
                    extraUnitPrice === 0 || (extraType === "Personalizado" && !customExtra.trim())
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Extra
                </Button>
              </div>
            )}

            {/* Items List */}
            {items.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Itens Adicionados</h4>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {item.type === "editorial_service"
                            ? "Serviço Editorial"
                            : item.type === "printing"
                              ? "Impressão"
                              : "Extra"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                        <span>Qtd: {item.quantity}</span>
                        <span>
                          Unit:{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.unitPrice)}
                        </span>
                        <span className="font-medium text-gray-900">
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
            )}
          </div>

          {/* Section 5: Condições Comerciais */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              5. Condições Comerciais
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Formas de Pagamento *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div key={method} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`payment-${method}`}
                        checked={paymentMethods.includes(method)}
                        onChange={() => togglePaymentMethod(method)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={`payment-${method}`} className="cursor-pointer">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Validade (dias) *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prazo de Produção (dias)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={productionDays}
                    onChange={(e) => setProductionDays(parseInt(e.target.value) || 0)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="clientProvidedMaterial"
                    checked={clientProvidedMaterial}
                    onChange={(e) => setClientProvidedMaterial(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="clientProvidedMaterial" className="cursor-pointer">
                    Cliente fornecerá material
                  </Label>
                </div>
                {clientProvidedMaterial && (
                  <Textarea
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    placeholder="Descreva o material que o cliente fornecerá..."
                    rows={2}
                    disabled={loading}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Desconto (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => {
                      setDiscount(parseFloat(e.target.value) || 0);
                      setDiscountPercentage(0);
                    }}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Desconto (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discountPercentage}
                    onChange={(e) => {
                      setDiscountPercentage(parseFloat(e.target.value) || 0);
                      setDiscount(0);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
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
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Resumo Financeiro</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(calculateSubtotal())}
                </span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Desconto ({discountPercentage}%):</span>
                  <span className="font-medium">
                    -
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format((calculateSubtotal() * discountPercentage) / 100)}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Desconto:</span>
                  <span className="font-medium">
                    -
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3 text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-blue-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(calculateTotal())}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" onClick={onClose} variant="outline" disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || items.length === 0}>
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
