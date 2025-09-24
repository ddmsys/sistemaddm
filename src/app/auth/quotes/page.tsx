"use client";

import LogoutButton from "@/components/LogoutButton";
import { useState, useEffect, FormEvent } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface QuoteItem {
  id?: string;
  kind: "etapa" | "impressao";
  description: string;
  deadlineDays?: number;
  dueDate?: string;
  value?: number;
  qty?: number;
  unit?: string;
  unitPrice?: number;
  notes?: string;
}

interface Quote {
  id?: string;
  leadId: string;
  number: string;
  status: "draft" | "sent" | "signed" | "refused";
  quoteType: "producao" | "impressao" | "misto";
  currency: "BRL" | "USD" | "EUR";
  projectTitle: string;
  issueDate: string;
  validityDays: number;
  productionTime?: string;
  material?: any;
  items: QuoteItem[];
  terms?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface Lead {
  id: string;
  name?: string | null;
}

export default function QuotesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadId, setLeadId] = useState("");
  const [number, setNumber] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [quoteType, setQuoteType] = useState<Quote["quoteType"]>("producao");
  const [currency, setCurrency] = useState<Quote["currency"]>("BRL");
  const [issueDate, setIssueDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [validityDays, setValidityDays] = useState(10);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [terms, setTerms] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const leadsSnap = await getDocs(collection(db, "leads"));
        setLeads(
          leadsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lead))
        );
        const quotesSnap = await getDocs(collection(db, "quotes"));
        setQuotes(
          quotesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quote))
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function clearForm() {
    setLeadId("");
    setNumber("");
    setProjectTitle("");
    setQuoteType("producao");
    setCurrency("BRL");
    setIssueDate(new Date().toISOString().slice(0, 10));
    setValidityDays(10);
    setItems([]);
    setTerms("");
  }

  async function saveQuote(e: FormEvent) {
    e.preventDefault();
    if (!leadId) {
      alert("Selecione uma lead");
      return;
    }
    if (!projectTitle.trim()) {
      alert("Informe o título do projeto");
      return;
    }
    if (items.length === 0) {
      alert("Inclua ao menos um item");
      return;
    }

    const newQuote: Quote = {
      leadId,
      number: number.trim() || `Q-${Date.now().toString().slice(-4)}`,
      status: "draft",
      quoteType,
      currency,
      projectTitle: projectTitle.trim(),
      issueDate,
      validityDays,
      items,
      terms: terms.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (newQuote.id) {
        const { id, ...data } = newQuote;
        await updateDoc(doc(db, "quotes", id!), data);
      } else {
        await addDoc(collection(db, "quotes"), newQuote);
      }
      clearForm();
      const quotesSnap = await getDocs(collection(db, "quotes"));
      setQuotes(
        quotesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quote))
      );
    } catch (error) {
      alert("Erro ao salvar orçamento: " + error);
    }
  }

  async function deleteQuote(id: string) {
    if (!confirm("Confirma exclusão deste orçamento?")) return;
    try {
      await deleteDoc(doc(db, "quotes", id));
      const quotesSnap = await getDocs(collection(db, "quotes"));
      setQuotes(
        quotesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quote))
      );
    } catch (error) {
      alert("Erro ao excluir orçamento: " + error);
    }
  }

  function addItem() {
    setItems([...items, { kind: "etapa", description: "" }]);
  }

  function updateItem(idx: number, patch: Partial<QuoteItem>) {
    setItems(
      items.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  return (
    <>
      <main className="p-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Orçamentos</h1>
        <form
          onSubmit={saveQuote}
          className="mb-6 border rounded p-4 space-y-4 bg-gray-50"
        >
          <div>
            <label>Vincular a Lead *</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">— selecione —</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name ?? "(sem nome)"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Número</label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Q-0001"
            />
          </div>
          <div>
            <label>Título *</label>
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label>Tipo</label>
            <select
              value={quoteType}
              onChange={(e) =>
                setQuoteType(e.target.value as Quote["quoteType"])
              }
              className="w-full border p-2 rounded"
              required
            >
              <option value="producao">Produção</option>
              <option value="impressao">Impressão</option>
              <option value="misto">Misto</option>
            </select>
          </div>
          <div>
            <label>Moeda</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Quote["currency"])}
              className="w-full border p-2 rounded"
              required
            >
              <option value="BRL">BRL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label>Data de emissão</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label>Validade (dias)</label>
            <input
              type="number"
              min={1}
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Itens</label>
            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-3 py-1 rounded mb-2"
            >
              Adicionar Item
            </button>
            <ul>
              {items.map((item, idx) => (
                <li key={idx} className="mb-2 border p-2 rounded">
                  <input
                    type="text"
                    placeholder="Descrição"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(idx, { description: e.target.value })
                    }
                    className="w-full border p-1 rounded mb-1"
                  />
                  <select
                    value={item.kind}
                    onChange={(e) =>
                      updateItem(idx, {
                        kind: e.target.value as QuoteItem["kind"],
                      })
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="etapa">Etapa</option>
                    <option value="impressao">Impressão</option>
                  </select>
                  <button
                    onClick={() => removeItem(idx)}
                    className="mt-1 px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label>Condições e observações</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Salvar Orçamento
          </button>
        </form>

        {loading ? (
          <p>Carregando orçamentos...</p>
        ) : (
          <ul className="space-y-2">
            {quotes.map((quote) => (
              <li
                key={quote.id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <LogoutButton />
                <div>
                  <strong>{quote.number}</strong> - {quote.projectTitle}
                  <br />
                  Status: {quote.status} | Tipo: {quote.quoteType}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLeadId(quote.leadId);
                      setNumber(quote.number);
                      setProjectTitle(quote.projectTitle);
                      setQuoteType(quote.quoteType);
                      setCurrency(quote.currency);
                      setIssueDate(quote.issueDate);
                      setValidityDays(quote.validityDays);
                      setItems(quote.items);
                      setTerms(quote.terms ?? "");
                    }}
                    className="px-2 py-1 rounded bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteQuote(quote.id!)}
                    className="px-2 py-1 rounded bg-red-600 text-white"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
