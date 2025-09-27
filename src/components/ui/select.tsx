"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface Opt {
  value: string;
  label: string;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Opt[];
  error?: string;
  label?: string;
}

export function Select({ options, error, label, className, ...p }: Props) {
  const id = p.id ?? `select-${crypto.randomUUID()}`;
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border px-3",
          error ? "border-red-500" : "border-slate-300",
          className
        )}
        {...p}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
