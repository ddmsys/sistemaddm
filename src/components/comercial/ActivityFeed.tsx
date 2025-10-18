"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  type: "lead_created" | "budget_sent" | "project_approved" | "payment_received";
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  icon: string;
  color: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular dados de atividades
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: "1",
        type: "lead_created",
        title: "Novo lead criado",
        description: "Maria Silva - Editora ABC",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        user: "João Santos",
        icon: "👤",
        color: "text-blue-600",
      },
      {
        id: "2",
        type: "budget_sent",
        title: "Orçamento enviado",
        description: "ORC-2024-001 - R$ 15.000",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
        user: "Ana Costa",
        icon: "📧",
        color: "text-emerald-600",
      },
      {
        id: "3",
        type: "project_approved",
        title: "Projeto aprovado",
        description: 'Livro "História do Brasil"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4h atrás
        user: "Carlos Lima",
        icon: "✅",
        color: "text-purple-600",
      },
      {
        id: "4",
        type: "payment_received",
        title: "Pagamento recebido",
        description: "R$ 7.500 - Primeira parcela",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6h atrás
        user: "Sistema",
        icon: "💰",
        color: "text-amber-600",
      },
    ];

    // Simular loading
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return "Agora";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-200"></div>
              <div className="flex-1">
                <div className="mb-2 h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="h-3 w-1/2 rounded bg-slate-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
            <span className="text-sm">{activity.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">{activity.title}</p>
            <p className="text-sm text-slate-600">{activity.description}</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-slate-500">{activity.user}</p>
              <span className="text-xs text-slate-400">•</span>
              <p className="text-xs text-slate-500">{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-500">Nenhuma atividade recente</p>
        </div>
      )}
    </div>
  );
}
