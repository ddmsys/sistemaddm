import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Client {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  clientNumber?: number;
  status: "ativo" | "inativo";
  address?: {
    zipcode?: string;
    street?: string;
    number?: string;
    city?: string;
    state?: string;
  };
  indication?: string;
  source?:
    | "website"
    | "referral"
    | "social_media"
    | "cold_call"
    | "event"
    | "advertising"
    | "other";
  notes?: string;
  firebaseAuthUid?: string; // Para portal do cliente
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "clients"), orderBy("clientNumber", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Client)
      );

      setClients(clientsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createClient = async (
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const docRef = await addDoc(collection(db, "clients"), {
        ...clientData,
        status: clientData.status || "ativo",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      await updateDoc(doc(db, "clients", id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  };

  return {
    clients,
    loading,
    createClient,
    updateClient,
  };
}
