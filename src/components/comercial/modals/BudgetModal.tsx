"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import type { Budget, BudgetFormData, BudgetItem } from "@/lib/types/budgets";
import {
  EditorialServiceType,
  ExtraType,
  type EditorialServiceItem,
  type ExtraItem,
  type PrintingItem,
} from "@/lib/types/budgets";
import type { Lead } from "@/lib/types/leads";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BudgetFormData) => Promise<void>;
  budget?: Budget | null;
  leads?: Lead[];
  mode?: "create" | "edit";
}

export function BudgetModal({
  isOpen,
  onClose,
  onSave,
  budget,
  leads = [],
  mode = "create",
}: BudgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"basic" | "items" | "conditions">("basic");

  // ✅ ORIGEM: Lead ou Cliente
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [originType, setOriginType] = useState<"lead" | "client">("lead");

  // ✅ DADOS DO PROJETO
  const [projectType, setProjectType] = useState<ProjectCatalogType>(ProjectCatalogType.BOOK);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectSubtitle, setProjectSubtitle] = useState("");
  const [projectAuthor, setProjectAuthor] = useState("");

  // ✅ ITENS DO ORÇAMENTO
  const [items, setItems] = useState<BudgetItem[]>([]);

  // ✅ ITEM ATUAL SENDO ADICIONADO
  const [currentItem, setCurrentItem] = useState<Partial<BudgetItem>>({
    type: "editorial_service",
    quantity: 1,
    unitPrice: 0,
  });

  // ✅ CONDIÇÕES COMERCIAIS
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["PIX"]);
  const [validityDays, setValidityDays] = useState(30);
  const [productionDays, setProductionDays] = useState<number>();
  const [clientProvidedMaterial, setClientProvidedMaterial] = useState(false);
  const [materialDescription, setMaterialDescription] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // ✅ CARREGAR DADOS DO ORÇAMENTO (MODO EDIÇÃO)
  useEffect(() => {
    if (budget && mode === "edit") {
      setSelectedLeadId(budget.leadId || "");
      setSelectedClientId(budget.clientId || "");
      setOriginType(budget.leadId ? "lead" : "client");
      setProjectType(budget.projectType || ProjectCatalogType.BOOK);
      setProjectTitle(budget.projectData?.title || "");
      setProjectSubtitle(budget.projectData?.subtitle || "");
      setProjectAuthor(budget.projectData?.author || "");
      setItems(budget.items || []);
      setPaymentMethods(budget.paymentMethods || ["PIX"]);
      setValidityDays(budget.validityDays || 30);
      setProductionDays(budget.productionDays);
      setClientProvidedMaterial(budget.clientProvidedMaterial || false);
      setMaterialDescription(budget.materialDescription || "");
      setDiscount(budget.discount || 0);
      setDiscountPercentage(budget.discountPercentage || 0);
      setNotes(budget.notes || "");
    }
  }, [budget, mode]);

  // ✅ PREENCHER DADOS AUTOMATICAMENTE AO SELECIONAR LEAD
  useEffect(() => {
    if (selectedLeadId && leads.length > 0) {
      const lead = leads.find((l) => l.id === selectedLeadId);
      if (lead) {
        // Preencher autor com nome do lead se estiver vazio
        if (!projectAuthor) {
          setProjectAuthor(lead.name);
        }
      }
    }
  }, [selectedLeadId, leads, projectAuthor]);

  // ✅ ADICIONAR ITEM À LISTA
  const handleAddItem = () => {
    // Validações
    if (!currentItem.description || currentItem.description.trim() === "") {
      toast.error("Descrição do item é obrigatória");
      return;
    }

    if (!currentItem.quantity || currentItem.quantity <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }

    if (!currentItem.unitPrice || currentItem.unitPrice <= 0) {
      toast.error("Preço unitário deve ser maior que zero");
      return;
    }

    // Calcular total do item
    const totalPrice = currentItem.quantity * currentItem.unitPrice;

    // Criar item completo
    const newItem: BudgetItem = {
      id: `item-${Date.now()}`,
      type: currentItem.type as BudgetItem["type"],
      description: currentItem.description,
      quantity: currentItem.quantity,
      unitPrice: currentItem.unitPrice,
      totalPrice,
      notes: currentItem.notes,
      // Campos específicos por tipo
      ...(currentItem.type === "editorial_service" && {
        service:
          (currentItem as Partial<EditorialServiceItem>).service || EditorialServiceType.CUSTOM,
        customService: (currentItem as Partial<EditorialServiceItem>).customService,
        estimatedDays: (currentItem as Partial<EditorialServiceItem>).estimatedDays,
      }),
      ...(currentItem.type === "printing" && {
        printRun: (currentItem as Partial<PrintingItem>).printRun || 100,
        useBookSpecs: (currentItem as Partial<PrintingItem>).useBookSpecs || false,
        customSpecs: (currentItem as Partial<PrintingItem>).customSpecs,
        productionDays: (currentItem as Partial<PrintingItem>).productionDays,
      }),
      ...(currentItem.type === "extra" && {
        extraType: (currentItem as Partial<ExtraItem>).extraType || ExtraType.CUSTOM,
        customExtra: (currentItem as Partial<ExtraItem>).customExtra,
      }),
    } as BudgetItem;

    // Adicionar à lista
    setItems([...items, newItem]);

    // Resetar item atual
    setCurrentItem({
      type: "editorial_service",
      quantity: 1,
      unitPrice: 0,
    });

    toast.success("Item adicionado!");
  };

  // ✅ REMOVER ITEM DA LISTA
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    toast.success("Item removido");
  };

  // ✅ CALCULAR TOTAIS
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    let total = subtotal;

    if (discountPercentage > 0) {
      total -= (subtotal * discountPercentage) / 100;
    }

    if (discount > 0) {
      total -= discount;
    }

    return {
      subtotal,
      total: Math.max(0, total),
    };
  };

  const { subtotal, total } = calculateTotals();

  // ✅ SALVAR ORÇAMENTO
  const handleSave = async () => {
    // Validações
    if (!originType) {
      toast.error("Selecione a origem (Lead ou Cliente)");
      return;
    }

    if (originType === "lead" && !selectedLeadId) {
      toast.error("Selecione um Lead");
      return;
    }

    if (originType === "client" && !selectedClientId) {
      toast.error("Selecione um Cliente");
      return;
    }

    if (!projectTitle || projectTitle.trim() === "") {
      toast.error("Título do projeto é obrigatório");
      return;
    }

    if (items.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento");
      return;
    }

    if (paymentMethods.length === 0) {
      toast.error("Selecione pelo menos uma forma de pagamento");
      return;
    }

    try {
      setLoading(true);

      const formData: BudgetFormData = {
        projectTitle,
        leadId: originType === "lead" ? selectedLeadId : undefined,
        clientId: originType === "client" ? selectedClientId : undefined,
        projectType,
        projectData: {
          title: projectTitle,
          subtitle: projectSubtitle || undefined,
          author: projectAuthor || undefined,
        },
        items: items.map(({ id: _id, totalPrice: _totalPrice, ...item }) => item),
        paymentMethods,
        validityDays,
        productionDays,
        clientProvidedMaterial,
        materialDescription: materialDescription || undefined,
        discount: discount > 0 ? discount : undefined,
        discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
        notes: notes || undefined,
      };

      await onSave(formData);
      toast.success(mode === "create" ? "Orçamento criado!" : "Orçamento atualizado!");
      handleClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar orçamento";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FECHAR MODAL
  const handleClose = () => {
    setCurrentStep("basic");
    setSelectedLeadId("");
    setSelectedClientId("");
    setOriginType("lead");
    setProjectType(ProjectCatalogType.BOOK);
    setProjectTitle("");
    setProjectSubtitle("");
    setProjectAuthor("");
    setItems([]);
    setCurrentItem({
      type: "editorial_service",
      quantity: 1,
      unitPrice: 0,
    });
    setPaymentMethods(["PIX"]);
    setValidityDays(30);
    setProductionDays(undefined);
    setClientProvidedMaterial(false);
    setMaterialDescription("");
    setDiscount(0);
    setDiscountPercentage(0);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Novo Orçamento" : "Editar Orçamento"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ✅ ETAPA 1: INFORMAÇÕES BÁSICAS */}
          {currentStep === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* ORIGEM: Lead ou Cliente */}
                <div className="space-y-2">
                  <Label>Origem do Orçamento</Label>
                  <Select
                    value={originType}
                    onValueChange={(value) => setOriginType(value as "lead" | "client")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead (Prospecção)</SelectItem>
                      <SelectItem value="client">Cliente Existente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* SELECIONAR LEAD */}
                {originType === "lead" && (
                  <div className="space-y-2">
                    <Label>Lead *</Label>
                    <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id!}>
                            {lead.name} {lead.company ? `- ${lead.company}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* SELECIONAR CLIENTE */}
                {originType === "client" && (
                  <div className="space-y-2">
                    <Label>Cliente *</Label>
                    <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id!}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* TIPO DE PROJETO */}
              <div className="space-y-2">
                <Label>Tipo de Projeto *</Label>
                <Select
                  value={projectType}
                  onValueChange={(value) => setProjectType(value as ProjectCatalogType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProjectCatalogType.BOOK}>Livro</SelectItem>
                    <SelectItem value={ProjectCatalogType.EBOOK}>E-book</SelectItem>
                    <SelectItem value={ProjectCatalogType.KINDLE}>Kindle</SelectItem>
                    <SelectItem value={ProjectCatalogType.PRINTING}>Gráfica</SelectItem>
                    <SelectItem value={ProjectCatalogType.CUSTOM}>Customizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* DADOS DO PROJETO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Título do Projeto *</Label>
                  <Input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Ex: Meu Primeiro Livro"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={projectSubtitle}
                    onChange={(e) => setProjectSubtitle(e.target.value)}
                    placeholder="Ex: Uma Jornada de Descobertas"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Input
                    value={projectAuthor}
                    onChange={(e) => setProjectAuthor(e.target.value)}
                    placeholder="Ex: João Silva"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep("items")}>Próximo: Adicionar Itens</Button>
              </div>
            </div>
          )}

          {/* ✅ ETAPA 2: ITENS DO ORÇAMENTO */}
          {currentStep === "items" && (
            <div className="space-y-4">
              {/* FORMULÁRIO DE ITEM */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-4 font-semibold">Adicionar Item</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* TIPO DE ITEM */}
                  <div className="space-y-2">
                    <Label>Tipo de Item</Label>
                    <Select
                      value={currentItem.type}
                      onValueChange={(value) =>
                        setCurrentItem({ ...currentItem, type: value as BudgetItem["type"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editorial_service">Serviço Editorial</SelectItem>
                        <SelectItem value="printing">Impressão</SelectItem>
                        <SelectItem value="extra">Extra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* SERVIÇO EDITORIAL */}
                  {currentItem.type === "editorial_service" && (
                    <div className="space-y-2">
                      <Label>Serviço</Label>
                      <Select
                        value={(currentItem as Partial<EditorialServiceItem>).service}
                        onValueChange={(value) =>
                          setCurrentItem({
                            ...currentItem,
                            service: value as EditorialServiceType,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EditorialServiceType.REVISION}>Revisão</SelectItem>
                          <SelectItem value={EditorialServiceType.COPYEDIT}>Copidesque</SelectItem>
                          <SelectItem value={EditorialServiceType.LAYOUT}>Diagramação</SelectItem>
                          <SelectItem value={EditorialServiceType.COVER}>Capa</SelectItem>
                          <SelectItem value={EditorialServiceType.CUSTOM}>Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* DESCRIÇÃO */}
                  <div className="col-span-2 space-y-2">
                    <Label>Descrição *</Label>
                    <Input
                      value={currentItem.description || ""}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, description: e.target.value })
                      }
                      placeholder="Descreva o item do orçamento"
                    />
                  </div>

                  {/* QUANTIDADE */}
                  <div className="space-y-2">
                    <Label>Quantidade *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={currentItem.quantity || 1}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>

                  {/* PREÇO UNITÁRIO */}
                  <div className="space-y-2">
                    <Label>Preço Unitário (R$) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentItem.unitPrice || 0}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  {/* TOTAL DO ITEM */}
                  <div className="col-span-2 space-y-2">
                    <Label>Total do Item</Label>
                    <div className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format((currentItem.quantity || 0) * (currentItem.unitPrice || 0))}
                    </div>
                  </div>
                </div>

                <Button onClick={handleAddItem} className="mt-4 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>

              {/* LISTA DE ITENS ADICIONADOS */}
              {items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Itens Adicionados ({items.length})</h3>

                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border bg-white p-3"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} x{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.unitPrice)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-semibold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.totalPrice)}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SUBTOTAL */}
                  <div className="mt-4 flex justify-between border-t pt-4">
                    <div className="text-lg font-semibold">Subtotal:</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(subtotal)}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("basic")}>
                  Voltar
                </Button>
                <Button onClick={() => setCurrentStep("conditions")} disabled={items.length === 0}>
                  Próximo: Condições
                </Button>
              </div>
            </div>
          )}

          {/* ✅ ETAPA 3: CONDIÇÕES COMERCIAIS */}
          {currentStep === "conditions" && (
            <div className="space-y-4">
              {/* FORMAS DE PAGAMENTO */}
              <div className="space-y-2">
                <Label>Formas de Pagamento *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["PIX", "Cartão", "Boleto", "Transferência"].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        checked={paymentMethods.includes(method)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPaymentMethods([...paymentMethods, method]);
                          } else {
                            setPaymentMethods(paymentMethods.filter((m) => m !== method));
                          }
                        }}
                      />
                      <label className="text-sm">{method}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRAZOS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Validade (dias) *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prazo de Produção (dias)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={productionDays || ""}
                    onChange={(e) =>
                      setProductionDays(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>

              {/* DESCONTOS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Desconto (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* MATERIAL FORNECIDO PELO CLIENTE */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={clientProvidedMaterial}
                    onCheckedChange={(checked) => setClientProvidedMaterial(!!checked)}
                  />
                  <Label>Cliente fornecerá material</Label>
                </div>

                {clientProvidedMaterial && (
                  <Textarea
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    placeholder="Descreva o material que será fornecido pelo cliente"
                  />
                )}
              </div>

              {/* OBSERVAÇÕES */}
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre o orçamento"
                  rows={3}
                />
              </div>

              {/* RESUMO FINANCEIRO */}
              <div className="rounded-lg border bg-blue-50 p-4">
                <h3 className="mb-3 font-semibold">Resumo Financeiro</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(subtotal)}
                    </span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Desconto ({discountPercentage}%):</span>
                      <span>
                        -{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format((subtotal * discountPercentage) / 100)}
                      </span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Desconto adicional:</span>
                      <span>
                        -{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>TOTAL:</span>
                    <span className="text-blue-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("items")}>
                  Voltar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading
                    ? "Salvando..."
                    : mode === "create"
                      ? "Criar Orçamento"
                      : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
