'use client';

import { CheckCircle, FileText, User } from 'lucide-react';

import { Lead } from '@/lib/types/leads';
import { Quote } from '@/lib/types/quotes';

interface RecentActivitiesProps {
  leads: Lead[];
  quotes: Quote[];
  onViewLead: (lead: Lead) => void;
}

export function RecentActivities({ leads, quotes, onViewLead }: RecentActivitiesProps) {
  const activities = [
    {
      type: 'lead',
      icon: User,
      title: 'Novo lead:',
      subtitle: 'João Mendes',
      time: 'há 2 horas',
      color: 'text-teal-600',
    },
    {
      type: 'quote',
      icon: FileText,
      title: 'Orçamento aprovado:',
      subtitle: 'Manual de Marketing Digital',
      time: 'há 1 dia',
      color: 'text-blue-600',
    },
    {
      type: 'project',
      icon: CheckCircle,
      title: 'Projeto finalizado:',
      subtitle: 'Receitas da Vovó',
      time: 'há 3 dias',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        return (
          <div
            key={index}
            className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className={`rounded-full bg-gray-100 p-2 ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{activity.title}</span>
                  <span className="text-sm font-medium text-gray-900">{activity.subtitle}</span>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
