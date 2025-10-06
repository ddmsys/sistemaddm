'use client';

import { Calendar, Download, Eye, FileText, MoreHorizontal, Send, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { Quote, QuoteStatus } from '@/lib/types';
import { cn, formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';

interface QuoteCardProps {
  quote: Quote;
  onStatusChange?: (quoteId: string, status: QuoteStatus) => void;
  onEdit?: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
  onConvert?: (quoteId: string) => void;
  onDownload?: (quoteId: string) => void;
  onSend?: (quoteId: string) => void;
}

const statusConfig = {
  draft: {
    label: 'Rascunho',
    color: 'secondary',
    class: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: FileText,
  },
  sent: {
    label: 'Enviado',
    color: 'info',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Send,
  },
  viewed: {
    label: 'Visualizado',
    color: 'warning',
    class: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Eye,
  },
  signed: {
    label: 'Assinado',
    color: 'success',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: FileText,
  },
  rejected: {
    label: 'Rejeitado',
    color: 'destructive',
    class: 'bg-red-50 text-red-700 border-red-200',
    icon: FileText,
  },
  expired: {
    label: 'Expirado',
    color: 'secondary',
    class: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: Calendar,
  },
};

export function QuoteCard({
  quote,
  onStatusChange,
  onEdit,
  onDelete,
  onConvert,
  onDownload,
  onSend,
}: QuoteCardProps) {
  const [showActions, setShowActions] = useState(false);
  const status = statusConfig[quote.status];
  const StatusIcon = status.icon;

  const isExpired = quote.valid_until.toDate() < new Date();
  const daysUntilExpiry = Math.ceil(
    (quote.valid_until.toDate().getTime() - new Date().getTime()) / (1000 * 3600 * 24),
  );

  return (
    <>
      <Card
        variant="interactive"
        className={cn(
          'group relative transition-all duration-200 hover:shadow-lg',
          status.class,
          isExpired && 'opacity-75',
        )}
      >
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <StatusIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-primary-900">{quote.title}</h3>
                <p className="text-xs text-primary-500">{quote.quote_number}</p>
                <div className="mt-1 flex items-center text-xs text-primary-600">
                  <User className="mr-1 h-3 w-3" />
                  <span className="truncate">{quote.client_name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  status.color as
                    | 'default'
                    | 'secondary'
                    | 'success'
                    | 'warning'
                    | 'destructive'
                    | 'info'
                    | 'outline'
                }
                size="sm"
              >
                {status.label}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setShowActions(true)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 px-4 pb-4">
          {/* Value */}
          <div className="rounded-md bg-primary-50 py-2 text-center">
            <div className="text-lg font-bold text-primary-900">{formatCurrency(quote.total)}</div>
            {quote.discount_amount > 0 && (
              <div className="text-xs text-emerald-600">
                Desconto: {formatCurrency(quote.discount_amount)}
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="text-xs text-primary-600">
            <span className="font-medium">{quote.items.length}</span>
            {quote.items.length === 1 ? ' item' : ' itens'}
          </div>

          {/* Dates */}
          <div className="space-y-1 text-xs text-primary-600">
            <div className="flex items-center justify-between">
              <span>Criado:</span>
              <span>{formatDate(quote.created_at.toDate())}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Válido até:</span>
              <span
                className={cn(
                  isExpired && 'font-medium text-red-600',
                  daysUntilExpiry <= 3 && daysUntilExpiry > 0 && 'font-medium text-amber-600',
                )}
              >
                {formatDate(quote.valid_until.toDate())}
                {daysUntilExpiry > 0 && daysUntilExpiry <= 7 && (
                  <span className="ml-1">({daysUntilExpiry}d)</span>
                )}
                {isExpired && <span className="ml-1">(Expirado)</span>}
              </span>
            </div>

            {quote.sent_date && (
              <div className="flex items-center justify-between">
                <span>Enviado:</span>
                <span>{formatRelativeTime(quote.sent_date.toDate())}</span>
              </div>
            )}

            {quote.viewed_date && (
              <div className="flex items-center justify-between">
                <span>Visualizado:</span>
                <span>{formatRelativeTime(quote.viewed_date.toDate())}</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-1">
            {(['draft', 'sent', 'viewed', 'signed'] as QuoteStatus[]).map((step, index) => (
              <div
                key={step}
                className={cn(
                  'h-1 flex-1 rounded',
                  index <= Object.keys(statusConfig).indexOf(quote.status)
                    ? 'bg-blue-500'
                    : 'bg-primary-200',
                )}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between px-4 pb-3 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center space-x-2">
            {quote.status === 'draft' && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => onSend?.(quote.id)}
              >
                <Send className="mr-1 h-3 w-3" />
                Enviar
              </Button>
            )}

            {quote.pdf_url && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => onDownload?.(quote.id)}
              >
                <Download className="mr-1 h-3 w-3" />
                PDF
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="text-xs" onClick={() => onEdit?.(quote)}>
              Editar
            </Button>

            {quote.status === 'signed' && !quote.converted_to_project_id && (
              <Button
                size="sm"
                variant="default"
                className="text-xs"
                onClick={() => onConvert?.(quote.id)}
              >
                Projeto
              </Button>
            )}
          </div>
        </div>

        {/* Converted Badge */}
        {quote.converted_to_project_id && (
          <div className="absolute -right-2 -top-2">
            <Badge variant="success" className="text-xs">
              Convertido
            </Badge>
          </div>
        )}
      </Card>

      {/* Actions Modal */}
      <Modal
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Ações do Orçamento"
        size="sm"
      >
        <div className="space-y-2">
          {quote.status === 'draft' && (
            <Button
              variant="default"
              className="w-full justify-start"
              onClick={() => {
                onSend?.(quote.id);
                setShowActions(false);
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar Orçamento
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onEdit?.(quote);
              setShowActions(false);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Editar Orçamento
          </Button>

          {quote.pdf_url && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onDownload?.(quote.id);
                setShowActions(false);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
          )}

          <hr className="my-2" />

          {Object.entries(statusConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={quote.status === key ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                onStatusChange?.(quote.id, key as QuoteStatus);
                setShowActions(false);
              }}
            >
              Marcar como {config.label}
            </Button>
          ))}

          <hr className="my-2" />

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={() => {
              onDelete?.(quote.id);
              setShowActions(false);
            }}
          >
            Excluir Orçamento
          </Button>
        </div>
      </Modal>
    </>
  );
}
