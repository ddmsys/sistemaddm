// src/context/AuthContext.tsx
"use client";

import { auth } from "@/lib/firebase";
import { AuthUser } from "@/lib/types";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | undefined>(undefined); // COLOQUE AQUI

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      // ✅ USUÁRIO TEMPORÁRIO PARA DESENVOLVIMENTO
      if (!user) {
        // Simular usuário logado para desenvolvimento
        const mockUser: AuthUser = {
          uid: "dev-user-123",
          email: "dev@sistemaddm.com",
          displayName: "Usuário Dev",
          photoURL: null,
          role: "admin",
        };
        setUser(mockUser);
        setRole("admin");
      } else {
        const authUser: AuthUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "admin", // TODO: Buscar role real do Firestore
        };
        setUser(authUser);
        setRole("admin");
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
