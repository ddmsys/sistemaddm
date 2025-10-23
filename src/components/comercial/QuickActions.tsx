"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "Novo Lead",
      icon: "👤",
      action: () => router.push("/crm/leads?action=new"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Novo Cliente", // ✅ ADICIONADO
      icon: "🏢",
      action: () => router.push("/crm/clients?action=new"),
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      label: "Novo Orçamento",
      icon: "📄",
      action: () => router.push("/budgets?action=new"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      label: "Novo Projeto",
      icon: "🚀",
      action: () => router.push("/crm/projects?action=new"),
      color: "bg-amber-500 hover:bg-amber-600",
    },
    {
      label: "Ver Clientes", // ✅ ADICIONADO - LINK PARA LISTA
      icon: "👥",
      action: () => router.push("/crm/clients"),
      color: "bg-slate-500 hover:bg-slate-600",
    },
  ];

  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={action.action}
          className={`w-full justify-start text-white ${action.color} border-0`}
        >
          <span className="mr-2">{action.icon}</span>
          {action.label}
        </Button>
      ))}
    </div>
  );
}
