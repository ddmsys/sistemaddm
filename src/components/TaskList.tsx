'use client';

import { useState } from 'react';

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
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('pendente');

  function addTask() {
    if (!name) return alert('Nome da tarefa é obrigatório');
    setTasks([...tasks, { id: crypto.randomUUID(), name, description: desc, status }]);
    setName('');
    setDesc('');
    setStatus('pendente');
  }

  function removeTask(id?: string) {
    if (!id) return;
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <div className="mb-3 rounded border p-3">
      <h3 className="mb-2 font-semibold">Tarefas</h3>

      <ul className="mb-3 space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded border p-2">
            <div>
              <strong>{t.name}</strong> <br />
              {t.description} <br />
              Status: {t.status}
            </div>
            <button
              className="rounded bg-red-500 px-2 py-1 text-white"
              onClick={() => removeTask(t.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-end space-x-2">
        <div>
          <label>Nome*</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border p-1"
          />
        </div>
        <div>
          <label>Descrição</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="rounded border p-1"
          />
        </div>
        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border p-1"
          >
            <option value="pendente">Pendente</option>
            <option value="em_progresso">Em progresso</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
        <button className="rounded bg-green-500 px-3 text-white" type="button" onClick={addTask}>
          Adicionar
        </button>
      </div>
    </div>
  );
}
