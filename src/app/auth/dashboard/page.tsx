"use client";

import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: 32 }}>
      <h1>Dashboard</h1>
      <p>
        Escolha um módulo acima para navegar e testar as funcionalidades.
        <br />
        Os links levam direto para cada CRUD/tela principal.
      </p>
      <LogoutButton />
    </main>
  );
}
