"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ marginBottom: 20 }}>
      <Link href="/dashboard">Dashboard</Link> |{" "}
      <Link href="/clients">Clientes</Link> |{" "}
      <Link href="/projects">Projetos</Link> |{" "}
      <Link href="/register">Cadastro</Link> |{" "}
      {user ? (
        <>
          Olá, {user.email} <button onClick={logout}>Sair</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
