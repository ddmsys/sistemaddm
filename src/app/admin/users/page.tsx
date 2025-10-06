"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const ref = collection(db, "users");
        const snapshot = await getDocs(ref);
        const lista: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(lista);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    }
    void fetchUsers();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <main>
        <h1>Usuários cadastrados</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : users.length === 0 ? (
          <p>Nenhum usuário cadastrado.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.email} | {user.role}
              </li>
            ))}
          </ul>
        )}
      </main>
    </ProtectedRoute>
  );
}
