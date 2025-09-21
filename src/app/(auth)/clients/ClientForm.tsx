"use client";

import { useState, useEffect, FormEvent } from "react";

interface ClientFormProps {
  initialData?: {
    id?: string;
    name: string;
    email: string;
  };
  onSubmit: (data: {
    id?: string;
    name: string;
    email: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: ClientFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");

  useEffect(() => {
    setName(initialData?.name ?? "");
    setEmail(initialData?.email ?? "");
  }, [initialData]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      alert("Nome e email são obrigatórios");
      return;
    }
    await onSubmit({ id: initialData?.id, name, email });
    setName("");
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded p-4 bg-gray-50 space-y-4"
    >
      <div>
        <label className="block mb-1 font-semibold">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-2 py-1"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-2 py-1"
          required
          disabled={loading}
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {initialData ? "Salvar" : "Adicionar"}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-400 rounded"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
