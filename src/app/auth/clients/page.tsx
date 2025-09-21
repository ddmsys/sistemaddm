"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import ClientForm from "./ClientForm";

export interface Client {
  id: string;
  name: string;
  email: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const clientsCol = collection(db, "clients");
      const snapshot = await getDocs(clientsCol);
      const clientsList = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Client)
      );
      setClients(clientsList);
    } catch (error) {
      alert("Erro ao buscar clientes: " + error);
    } finally {
      setLoading(false);
    }
  }

  async function saveClient(data: Omit<Client, "id"> & { id?: string }) {
    setSaving(true);
    try {
      if (data.id) {
        const docRef = doc(db, "clients", data.id);
        await updateDoc(docRef, { name: data.name, email: data.email });
        setEditClient(null);
      } else {
        await addDoc(collection(db, "clients"), {
          name: data.name,
          email: data.email,
        });
      }
      fetchClients();
    } catch (error) {
      alert("Erro ao salvar cliente: " + error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient(id: string) {
    if (!confirm("Confirma exclusão deste cliente?")) return;
    try {
      await deleteDoc(doc(db, "clients", id));
      fetchClients();
    } catch (error) {
      alert("Erro ao excluir cliente: " + error);
    }
  }

  if (loading) return <p>Carregando clientes...</p>;

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <ClientForm
        key={editClient?.id ?? "new"}
        initialData={editClient ?? undefined}
        onSubmit={saveClient}
        onCancel={() => setEditClient(null)}
        loading={saving}
      />

      <ul className="mt-6 space-y-3">
        {clients.map((client) => (
          <li
            key={client.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <strong>{client.name}</strong> — {client.email}
            </div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 bg-yellow-400 rounded"
                onClick={() => setEditClient(client)}
              >
                Editar
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => deleteClient(client.id)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
