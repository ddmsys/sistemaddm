"use client";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/hooks/useAuth"; // ✅ CORRETO

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
