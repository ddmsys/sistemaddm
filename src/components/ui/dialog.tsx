// src/components/ui/dialog.tsx
'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

export function Dialog({ isOpen, onClose, children, title, size = 'md', className }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Dialog */}
      <div
        className={cn(
          'relative mx-4 w-full rounded-lg bg-white shadow-xl',
          sizeClasses[size],
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b p-6">
            <h2 id="dialog-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Fechar dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={title ? 'p-6' : 'p-6'}>{children}</div>

        {/* Close button when no title */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Fechar dialog"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Export para compatibilidade
export { Dialog as DialogPrimitive };
