'use client';

import { Calendar, DollarSign, Package, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useOrders } from '@/hooks/comercial/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/lib/types/orders';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { orders, loading } = useOrders({ realtime: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Faça login para continuar</p>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.bookCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    active: orders.filter((o) => o.status === 'active').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    totalValue: orders.reduce((sum, o) => sum + o.totalValue, 0),
  };

  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Ativo',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Pedidos</h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(stats.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border py-2 pl-10 pr-4"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-4 py-2"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <p className="text-gray-600">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order: Order) => (
            <div
              key={order.id}
              onClick={() => router.push(`/orders/${order.id}`)}
              className="cursor-pointer rounded-lg border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{order.bookCode}</h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-gray-600">{order.projectTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(order.totalValue)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="text-gray-600">Cliente</p>
                  <p className="font-medium">{order.clientName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Data</p>
                  <p className="font-medium">
                    {order.createdAt.toDate().toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Prazo</p>
                  <p className="font-medium">{order.deadline} dias</p>
                </div>
                <div>
                  <p className="text-gray-600">Itens</p>
                  <p className="font-medium">{order.items.length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
