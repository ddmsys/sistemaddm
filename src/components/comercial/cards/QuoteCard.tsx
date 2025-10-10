// src/components/comercial/cards/QuoteCard.tsx
'use client';

import { Calendar, Download, Eye, FileText, MoreHorizontal, Send, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { Quote, QuoteStatus } from '@/lib/types/quotes';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

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
    class: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Eye,
  },
  signed: {
    label: 'Assinado',
    color: 'success',
    class: 'bg-green-50 text-green-700 border-green-200',
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
    color: 'destructive',
    class: 'bg-gray-50 text-gray-500 border-gray-200',
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

  const isExpired = quote.validUntil
    ? (quote.validUntil instanceof Date ? quote.validUntil : quote.validUntil.toDate()) < new Date()
    : false;

  const daysUntilExpiry = quote.validUntil
    ? Math.ceil(
        ((quote.validUntil instanceof Date
          ? quote.validUntil
          : quote.validUntil.toDate()
        ).getTime() -
          new Date().getTime()) /
          (1000 * 3600 * 24),
      )
    : null;

  return (
    <>
      <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">{quote.projectTitle}</h3>
            <p className="text-xs text-primary-500">{quote.number}</p>
            <p className="mt-1 truncate text-sm text-gray-600">
              <User className="mr-1 inline h-4 w-4" />
              {quote.clientName}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={status.class}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowActions(true)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 px-6 pb-6">
          {quote.description && (
            <p className="line-clamp-2 text-sm text-gray-600">{quote.description}</p>
          )}

          <div className="space-y-2">
            <div className="text-lg font-bold text-primary-900">
              {formatCurrency(quote.totals?.total || quote.grandTotal || 0)}
            </div>
            {(quote.totals?.discount || quote.discount || 0) > 0 && (
              <p className="text-sm text-gray-600">
                Desconto: {formatCurrency(quote.totals?.discount || quote.discount || 0)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Emitido:</span>
              <span className="block font-medium">
                {formatDate(
                  quote.createdAt instanceof Date
                    ? quote.createdAt
                    : quote.createdAt?.toDate() || new Date(),
                )}
              </span>
            </div>

            <div>
              <span className="text-gray-600">Válido até:</span>
              <div className="block">
                {quote.validUntil
                  ? formatDate(
                      quote.validUntil instanceof Date
                        ? quote.validUntil
                        : quote.validUntil.toDate(),
                    )
                  : 'N/A'}
                {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                  <span className="ml-1 text-xs text-amber-600">({daysUntilExpiry}d)</span>
                )}
                {isExpired && <span className="ml-1 text-xs text-red-600">(Expirado)</span>}
              </div>
            </div>
          </div>

          {/* Corrigido: Campos opcionais com verificação */}
          {quote.sentAt && (
            <div className="text-sm text-gray-600">
              <span>Enviado: </span>
              <span>
                {formatDateTime(
                  quote.sentAt instanceof Date
                    ? quote.sentAt
                    : (quote.sentAt as any)?.toDate?.() || new Date(),
                )}
              </span>
            </div>
          )}

          {quote.viewedAt && (
            <div className="text-sm text-gray-600">
              <span>Visualizado: </span>
              <span>
                {formatDateTime(
                  quote.viewedAt instanceof Date
                    ? quote.viewedAt
                    : (quote.viewedAt as any)?.toDate?.() || new Date(),
                )}
              </span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            {quote.status === 'draft' && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onSend?.(quote.id!)}
              >
                Enviar
              </Button>
            )}

            {quote.pdfUrl && (
              <Button variant="outline" size="sm" onClick={() => onDownload?.(quote.id!)}>
                <Download className="mr-1 h-4 w-4" />
                PDF
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => onEdit?.(quote)}>
              Editar
            </Button>
          </div>

          {quote.status === 'signed' && !quote.convertedToProjectId && (
            <Button className="w-full" onClick={() => onConvert?.(quote.id!)}>
              Converter em Projeto
            </Button>
          )}

          {quote.convertedToProjectId && (
            <div className="text-center text-sm font-medium text-green-600">
              ✓ Convertido em Projeto
            </div>
          )}
        </div>

        {isExpired && (
          <div className="absolute right-0 top-0 rounded-bl bg-red-500 px-2 py-1 text-xs text-white">
            Expirado
          </div>
        )}
      </Card>

      <Modal
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Ações do Orçamento"
        size="sm"
      >
        <div className="space-y-2">
          {quote.status === 'draft' && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onSend?.(quote.id!);
                setShowActions(false);
              }}
            >
              Enviar Orçamento
            </Button>
          )}

          {quote.pdfUrl && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onDownload?.(quote.id!);
                setShowActions(false);
              }}
            >
              Download PDF
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
            Editar Orçamento
          </Button>

          {Object.entries(statusConfig).map(([key, config]) => (
            <Button
              key={key}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onStatusChange?.(quote.id!, key as QuoteStatus);
                setShowActions(false);
              }}
            >
              Alterar para {config.label}
            </Button>
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600"
            onClick={() => {
              onDelete?.(quote.id!);
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
