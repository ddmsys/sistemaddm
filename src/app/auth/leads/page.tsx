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

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const leadsCol = collection(db, "leads");
      const snapshot = await getDocs(leadsCol);
      setLeads(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lead))
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveLead(e: FormEvent) {
    e.preventDefault();
    if (!editLead || !editLead.name || !editLead.email) {
      alert("Nome e e-mail são obrigatórios");
      return;
    }
    setSaving(true);
    try {
      if (editLead.id) {
        const docRef = doc(db, "leads", editLead.id);
        await updateDoc(docRef, editLead);
      } else {
        await addDoc(collection(db, "leads"), editLead);
      }
      setEditLead(null);
      fetchLeads();
    } catch (err) {
      alert("Erro ao salvar lead: " + err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Confirma exclusão do lead?")) return;
    await deleteDoc(doc(db, "leads", id));
    fetchLeads();
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Leads</h1>

      <form
        onSubmit={saveLead}
        className="mb-6 border rounded p-4 space-y-4 bg-gray-50"
      >
        <div>
          <label className="block mb-1 font-semibold">Nome *</label>
          <input
            type="text"
            className="w-full border px-2 py-1 rounded"
            value={editLead?.name ?? ""}
            onChange={(e) =>
              setEditLead((prev) => ({ ...prev, name: e.target.value } as Lead))
            }
            disabled={saving}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">E-mail *</label>
          <input
            type="email"
            className="w-full border px-2 py-1 rounded"
            value={editLead?.email ?? ""}
            onChange={(e) =>
              setEditLead(
                (prev) => ({ ...prev, email: e.target.value } as Lead)
              )
            }
            disabled={saving}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Telefone</label>
          <input
            type="tel"
            className="w-full border px-2 py-1 rounded"
            value={editLead?.phone ?? ""}
            onChange={(e) =>
              setEditLead(
                (prev) => ({ ...prev, phone: e.target.value } as Lead)
              )
            }
            disabled={saving}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={editLead?.status ?? "new"}
            onChange={(e) =>
              setEditLead(
                (prev) => ({ ...prev, status: e.target.value } as Lead)
              )
            }
            disabled={saving}
          >
            <option value="new">Novo</option>
            <option value="contacted">Contato feito</option>
            <option value="qualified">Qualificado</option>
            <option value="converted">Convertido</option>
            <option value="lost">Perdido</option>
          </select>
        </div>

        <div className="flex space-x-2 justify-end">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 rounded"
            onClick={() => setEditLead(null)}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={saving}
          >
            Salvar Lead
          </button>
        </div>
      </form>

      {loading ? (
        <p>Carregando leads...</p>
      ) : (
        <ul className="space-y-2">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <div>
                <strong>{lead.name}</strong> - {lead.email}
                <br />
                Telefone: {lead.phone ?? "-"}
                <br />
                Status: {lead.status}
              </div>
              <div className="space-x-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded"
                  onClick={() => setEditLead(lead)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => deleteLead(lead.id!)}
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
