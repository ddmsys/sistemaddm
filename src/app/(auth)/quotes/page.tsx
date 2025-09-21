"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";

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
  email?: string | null;
}

export default function QuotesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // States form
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

  // Fetch leads and quotes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const leadsCol = collection(db, "leads");
        const leadsSnap = await getDocs(leadsCol);
        setLeads(
          leadsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Lead) }))
        );
        const quotesCol = collection(db, "quotes");
        const quotesSnap = await getDocs(quotesCol);
        setQuotes(
          quotesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Quote) }))
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
      alert("Selecione um lead");
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
        const docRef = doc(db, "quotes", newQuote.id);
        await updateDoc(docRef, newQuote);
      } else {
        const docRef = await addDoc(collection(db, "quotes"), newQuote);
      }
      clearForm();
      const quotesCol = collection(db, "quotes");
      const quotesSnap = await getDocs(quotesCol);
      setQuotes(
        quotesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Quote) }))
      );
    } catch (err) {
      alert("Erro ao salvar orçamento: " + err);
    }
  }

  async function deleteQuote(id: string) {
    if (!confirm("Confirma exclusão do orçamento?")) return;
    try {
      await deleteDoc(doc(db, "quotes", id));
      const quotesCol = collection(db, "quotes");
      const quotesSnap = await getDocs(quotesCol);
      setQuotes(
        quotesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Quote) }))
      );
    } catch (err) {
      alert("Erro ao excluir orçamento: " + err);
    }
  }

  // Manage items
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
          <label>Tipo *</label>
          <select
            value={quoteType}
            onChange={(e) => setQuoteType(e.target.value as Quote["quoteType"])}
            className="w-full border p-2 rounded"
            required
          >
            <option value="producao">Produção</option>
            <option value="impressao">Impressão</option>
            <option value="misto">Misto</option>
          </select>
        </div>

        <div>
          <label>Moeda *</label>
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
          <label>Data emissão *</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Validade (dias) *</label>
          <input
            type="number"
            min={1}
            className="w-full border p-2 rounded"
            value={validityDays}
            onChange={(e) => setValidityDays(Number(e.target.value))}
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
            Adicionar item
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
                  className="w-full border p-1 rounded"
                >
                  <option value="etapa">Etapa</option>
                  <option value="impressao">Impressão</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="bg-red-600 text-white px-3 py-1 rounded mt-1"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label>Condições / Observações</label>
          <textarea
            className="w-full border p-2 rounded"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
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
              className="border rounded p-3 flex justify-between"
            >
              <div>
                <strong>{quote.number}</strong> - {quote.projectTitle}
                <br />
                Status: {quote.status} | Tipo: {quote.quoteType}
              </div>
              <div className="space-x-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded"
                  onClick={() => {
                    // pra editar, carregar os dados no form
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
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => deleteQuote(quote.id!)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
