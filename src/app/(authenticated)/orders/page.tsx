"use client";

import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { OrderStatus } from "@/lib/types/orders"; // ✅ Import correto

// Dados mock para desenvolvimento
const mockOrders = [
  {
    id: "1",
    number: "PED-2025-001",
    clientId: "client1",
    clientName: "João Silva", // ✅ Campo presente
    projectTitle: "Manual de Instruções", // ✅ Campo presente
    bookCode: "DDML0001", // ✅ Campo presente
    status: OrderStatus.CONFIRMED,
    totalValue: 2500.0, // ✅ Campo presente
    deadline: 15, // ✅ Campo presente - dias
    issueDate: new Date(),
    budgetId: "budget1",
    bookId: "book1",
    bookTitle: "Manual",
    items: [],
    subtotal: 2500,
    total: 2500,
    payments: [],
    paymentStatus: "pending" as const,
    amountPaid: 0,
    amountDue: 2500,
    paymentMethods: ["Pix"],
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "user1",
  },
  {
    id: "2",
    number: "PED-2025-002",
    clientId: "client2",
    clientName: "Maria Santos", // ✅ Campo presente
    projectTitle: "Livro de Receitas", // ✅ Campo presente
    bookCode: "DDML0002", // ✅ Campo presente
    status: OrderStatus.IN_PRODUCTION,
    totalValue: 3200.0, // ✅ Campo presente
    deadline: 30, // ✅ Campo presente - dias
    issueDate: new Date(),
    budgetId: "budget2",
    bookId: "book2",
    bookTitle: "Receitas",
    items: [],
    subtotal: 3200,
    total: 3200,
    payments: [],
    paymentStatus: "pending" as const,
    amountPaid: 0,
    amountDue: 3200,
    paymentMethods: ["Cartão"],
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "user1",
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  // Mock hook - substitua pelo real
  const orders = mockOrders;

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          // ✅ Usando campos corretos que existem na interface
          order.bookCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || // ✅ Campo obrigatório
          order.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()), // ✅ Campo obrigatório
      );
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered;
  }, [orders, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      // ✅ Usando OrderStatus.CONFIRMED ao invés de 'active'
      active: orders.filter((o) => o.status === OrderStatus.CONFIRMED).length,
      completed: orders.filter((o) => o.status === OrderStatus.COMPLETED).length,
      // ✅ Usando totalValue que existe na interface
      totalValue: orders.reduce((sum, o) => sum + o.totalValue, 0),
    }),
    [orders],
  );

  // ✅ StatusColors e StatusLabels com ON_HOLD adicionado
  const statusColors = {
    [OrderStatus.PENDING]: "text-yellow-600 bg-yellow-100",
    [OrderStatus.CONFIRMED]: "text-blue-600 bg-blue-100",
    [OrderStatus.IN_PRODUCTION]: "text-purple-600 bg-purple-100",
    [OrderStatus.COMPLETED]: "text-green-600 bg-green-100",
    [OrderStatus.CANCELLED]: "text-red-600 bg-red-100",
    [OrderStatus.ON_HOLD]: "text-orange-600 bg-orange-100", // ✅ ADICIONADO
  };

  const statusLabels = {
    [OrderStatus.PENDING]: "Pendente",
    [OrderStatus.CONFIRMED]: "Confirmado",
    [OrderStatus.IN_PRODUCTION]: "Em Produção",
    [OrderStatus.COMPLETED]: "Concluído",
    [OrderStatus.CANCELLED]: "Cancelado",
    [OrderStatus.ON_HOLD]: "Em Espera", // ✅ ADICIONADO
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500">Gerencie pedidos de produção</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Novo Pedido
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-sm text-gray-500">Ativos</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">Concluídos</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-2xl font-bold text-purple-600">
            R$ {stats.totalValue.toLocaleString("pt-BR")}
          </div>
          <div className="text-sm text-gray-500">Valor Total</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, código do livro ou título..."
            className="w-full rounded-lg border py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
        >
          <option value="all">Todos os Status</option>
          <option value={OrderStatus.PENDING}>Pendente</option>
          <option value={OrderStatus.CONFIRMED}>Confirmado</option>
          <option value={OrderStatus.IN_PRODUCTION}>Em Produção</option>
          <option value={OrderStatus.COMPLETED}>Concluído</option>
          <option value={OrderStatus.CANCELLED}>Cancelado</option>
          <option value={OrderStatus.ON_HOLD}>Em Espera</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="rounded-lg border bg-white">
        <div className="grid grid-cols-12 gap-4 border-b bg-gray-50 p-4 text-sm font-medium text-gray-700">
          <div className="col-span-2">Número</div>
          <div className="col-span-2">Cliente</div>
          <div className="col-span-3">Projeto</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Valor</div>
          <div className="col-span-1">Prazo</div>
          <div className="col-span-1">Ações</div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum pedido encontrado</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="grid grid-cols-12 gap-4 border-b p-4 hover:bg-gray-50">
              <div className="col-span-2">
                <div className="font-medium">{order.number}</div>
                {/* ✅ Usando bookCode que existe na interface */}
                <div className="text-sm text-gray-500">{order.bookCode}</div>
              </div>
              <div className="col-span-2">
                {/* ✅ Usando clientName que existe na interface */}
                <div className="font-medium">{order.clientName}</div>
              </div>
              <div className="col-span-3">
                {/* ✅ Usando projectTitle que existe na interface */}
                <div className="font-medium">{order.projectTitle}</div>
              </div>
              <div className="col-span-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusColors[order.status] // ✅ Usando statusColors correto
                  }`}
                >
                  {statusLabels[order.status]} {/* ✅ Usando statusLabels correto */}
                </span>
              </div>
              <div className="col-span-2">
                <div className="font-medium">
                  {/* ✅ Usando totalValue que existe na interface */}
                  R$ {order.totalValue.toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="col-span-1">
                <div className="text-sm">
                  {/* ✅ Usando deadline que existe na interface */}
                  <span className="font-medium">{order.deadline} dias</span>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex gap-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
