"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import TaskList from "@/components/TaskList";
import { Project, ProjectStatus, Client, Book } from "@/lib/types";

interface Props {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

async function gerarCodigoProjeto(
  prefixo: string,
  clientNumber: number
): Promise<string> {
  const clienteFormatado = clientNumber.toString().padStart(4, "0");
  const col = collection(db, "projects");
  const q = query(
    col,
    where("clientNumber", "==", clientNumber),
    where("projectType", "==", prefixo)
  );
  const snapshot = await getDocs(q);
  const count = snapshot.size;
  if (count === 0) return `DDM${prefixo}${clienteFormatado}`;
  return `DDM${prefixo}${clienteFormatado}.${count}`;
}

export default function ProjectForm({ project, onSave, onCancel }: Props) {
  const [name, setName] = useState(project?.title ?? "");
  const [clientId, setClientId] = useState(project?.clientId ?? "");
  const [clientNumber, setClientNumber] = useState(project?.clientNumber ?? 0);
  const [projectType, setProjectType] = useState(project?.productType ?? "L");
  const [catalogCode, setCatalogCode] = useState(project?.catalogCode ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? "planejamento"
  );
  const [book, setBook] = useState<Book>(
    project?.book ?? { title: "", author: "", year: "", ISBN: "" }
  );
  const [tasks, setTasks] = useState<any[]>(project?.tasks ?? []);
  const [clientes, setClientes] = useState<Client[]>([]);

  useEffect(() => {
    async function buscarClientes() {
      const snap = await getDocs(collection(db, "clients"));
      const lista = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          number: data.number || 0,
        };
      });
      setClientes(lista);
    }
    buscarClientes();
  }, []);

  useEffect(() => {
    async function calcCodigo() {
      if (!clientNumber || !projectType) return;
      const codigo = await gerarCodigoProjeto(projectType, clientNumber);
      setCatalogCode(codigo);
    }
    calcCodigo();
  }, [clientNumber, projectType]);

  function handleClientChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    setClientId(selectedId);
    const cliente = clientes.find((c) => c.id === selectedId);
    setClientNumber(cliente?.clientNumber ?? 0);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!name || !clientId || !clientNumber) {
      alert("Campos obrigatórios incompletos");
      return;
    }
    const id = project?.id;
    const projRef = id
      ? doc(db, "projects", id)
      : doc(collection(db, "projects"));

    const data = {
      name,
      clientId,
      clientNumber,
      projectType,
      catalogCode,
      description,
      status,
      book: projectType === "L" ? book : null,
    };

    await setDoc(projRef, data, { merge: true });

    if (id) {
      const tasksCol = collection(db, "projects", id, "tasks");
      const oldTasks = await getDocs(tasksCol);
      for (const t of oldTasks.docs) await deleteDoc(t.ref);
      for (const t of tasks) await addDoc(tasksCol, t);
    }

    onSave();
  }

  return (
    <form className="border p-4 rounded mb-4" onSubmit={save}>
      <h2 className="text-lg font-semibold mb-3">
        {project ? "Editar Projeto" : "Novo Projeto"}
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <label>Nome*</label>
          <input
            className="w-full border p-1 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Cliente*</label>
          <select
            className="w-full border p-1 rounded"
            value={clientId}
            onChange={handleClientChange}
            required
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - Nº: {c.clientNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Número do Cliente*</label>
          <input
            type="number"
            className="w-full border p-1 rounded"
            value={clientNumber}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label>Tipo Projeto*</label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full border p-1 rounded"
            required
          >
            <option value="L">Livro</option>
            <option value="C">CD</option>
            <option value="D">DVD</option>
            <option value="S">Single</option>
            <option value="P">Plataformas digitais</option>
            <option value="G">Material gráfico</option>
            <option value="X">Livro de terceiros</option>
            <option value="E">Ebook</option>
            <option value="K">Kindle (ePub)</option>
            <option value="A">Arte em geral</option>
            <option value="M">Campanhas/Peças</option>
          </select>
        </div>

        <div>
          <label>Código Catálogo</label>
          <input
            className="w-full border p-1 rounded"
            value={catalogCode}
            readOnly
          />
        </div>
      </div>

      <div className="mb-3">
        <label>Descrição</label>
        <textarea
          className="w-full border p-1 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
        >
          <option value="planejamento">Planejamento</option>
          <option value="em_progresso">Em progresso</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      {projectType === "L" && (
        <fieldset className="border p-2 mb-3 rounded">
          <legend className="font-semibold">Ficha Técnica do Livro</legend>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Título</label>
              <input
                className="w-full border p-1 rounded"
                value={book.title}
                onChange={(e) =>
                  setBook((b) => ({ ...b, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label>Autor</label>
              <input
                className="w-full border p-1 rounded"
                value={book.author}
                onChange={(e) =>
                  setBook((b) => ({ ...b, author: e.target.value }))
                }
              />
            </div>
            <div>
              <label>Ano</label>
              <input
                className="w-full border p-1 rounded"
                value={book.year}
                onChange={(e) =>
                  setBook((b) => ({ ...b, year: e.target.value }))
                }
              />
            </div>
            <div>
              <label>ISBN</label>
              <input
                className="w-full border p-1 rounded"
                value={book.ISBN}
                onChange={(e) =>
                  setBook((b) => ({ ...b, ISBN: e.target.value }))
                }
              />
            </div>
          </div>
        </fieldset>
      )}

      <TaskList tasks={tasks} setTasks={setTasks} />

      <div className="flex space-x-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Salvar : Adicionar
        </button>
        {project && (
          <button
            className="bg-gray-400 text-black px-4 py-2 rounded"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
