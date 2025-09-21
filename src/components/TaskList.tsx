"use client";

import { useState } from "react";

interface Task {
  id?: string;
  name: string;
  description: string;
  status: string;
}

interface Props {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export default function TaskList({ tasks, setTasks }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("pendente");

  function addTask() {
    if (!name) return alert("Nome da tarefa é obrigatório");
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), name, description: desc, status },
    ]);
    setName("");
    setDesc("");
    setStatus("pendente");
  }

  function removeTask(id?: string) {
    if (!id) return;
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <div className="border p-3 mb-3 rounded">
      <h3 className="font-semibold mb-2">Tarefas</h3>

      <ul className="mb-3 space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center border rounded p-2"
          >
            <div>
              <strong>{t.name}</strong> <br />
              {t.description} <br />
              Status: {t.status}
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => removeTask(t.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <div className="flex space-x-2 items-end">
        <div>
          <label>Nome*</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Descrição</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="pendente">Pendente</option>
            <option value="em_progresso">Em progresso</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-3 rounded"
          type="button"
          onClick={addTask}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
