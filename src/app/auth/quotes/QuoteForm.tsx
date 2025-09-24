"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { QuoteItem } from "@/lib/types";

interface QuoteFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  leads: { id: string; name?: string | null }[];
}

export default function QuoteForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
  leads,
}: QuoteFormProps) {
  const [leadId, setLeadId] = useState(initialData?.leadId ?? "");
  const [number, setNumber] = useState(initialData?.number ?? "");
  const [projectTitle, setProjectTitle] = useState(
    initialData?.projectTitle ?? ""
  );
  const [quoteType, setQuoteType] = useState(
    initialData?.quoteType ?? "producao"
  );
  const [currency, setCurrency] = useState(initialData?.currency ?? "BRL");
  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate ?? new Date().toISOString().slice(0, 10)
  );
  const [validityDays, setValidityDays] = useState(
    initialData?.validityDays ?? 10
  );
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [terms, setTerms] = useState(initialData?.terms ?? "");

  function addItem() {
    setItems([...items, { kind: "etapa", description: "" }]);
  }

  function updateItem(idx: number, patch: Partial<QuoteItem>) {
    setItems(
      items.map((item: QuoteItem, i: number) =>
        i === idx ? { ...item, ...patch } : item
      )
    );
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i: number) => i !== idx));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({
      leadId,
      number,
      projectTitle,
      quoteType,
      currency,
      issueDate,
      validityDays,
      items,
      terms,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 border rounded p-4 space-y-4 bg-gray-50"
    >
      {/* campos do formulário igual código anterior */}… (preencha com os
      inputs conforme seu modelo)
      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Orçamento"}
      </Button>
    </form>
  );
}
