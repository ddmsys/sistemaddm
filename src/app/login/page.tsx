"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function callAssignClientNumber() {
    const assignClientNumber = httpsCallable(functions, "assignClientNumber");
    try {
      const result = await assignClientNumber({});
      console.log(
        "Função assignClientNumber chamada com sucesso:",
        result.data
      );
    } catch (error) {
      console.error("Erro ao chamar função assignClientNumber:", error);
    }
  }

  useEffect(() => {
    if (!loading && user) {
      const assignClientNumber = httpsCallable(functions, "assignClientNumber");
      assignClientNumber({})
        .then((result) => {
          console.log("Função chamada:", result.data);
        })
        .catch((e) => {
          console.error("Erro Cloud Function:", e);
        });
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError("Erro ao fazer login. Verifique email e senha.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
