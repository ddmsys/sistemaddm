"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import ProjectForm from "./ProjectForm";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const col = collection(db, "projects");
      const snapshot = await getDocs(col);
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Excluir projeto?")) return;
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  }

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Projetos</h1>

      <ProjectForm
        key={editProject?.id ?? "new"}
        project={editProject}
        onSave={() => {
          setEditProject(null);
          fetchProjects();
        }}
        onCancel={() => setEditProject(null)}
      />

      {loading ? (
        <p>Carregando projetos...</p>
      ) : (
        <ul className="space-y-2 mt-6">
          {projects.map((p) => (
            <li
              key={p.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <strong>{p.catalogCode ?? p.name}</strong> - {p.name}
                <br />
                Tipo: {p.projectType} - Status: {p.status}
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-400 rounded"
                  onClick={() => setEditProject(p)}
                >
                  Editar
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => deleteProject(p.id)}
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
