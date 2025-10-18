'use client';
import React from 'react';

import { cn } from '@/lib/utils';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export function Textarea({ error, label, className, ...p }: Props) {
  const id = p.id ?? `textarea-${crypto.randomUUID()}`;
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full rounded-lg border px-3 py-2',
          error ? 'border-red-500' : 'border-slate-300',
          className,
        )}
        {...p}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
