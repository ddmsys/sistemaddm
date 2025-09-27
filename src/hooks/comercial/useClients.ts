"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Client } from "@/lib/types/comercial";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ BUSCAR CLIENTES EM TEMPO REAL
  useEffect(() => {
    const clientsRef = collection(db, "clients");
    const q = query(clientsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const clientsData: Client[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          clientsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Client);
        });
        setClients(clientsData);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar clientes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ✅ CRIAR CLIENTE
  const createClient = async (clientData: Partial<Client>): Promise<string> => {
    try {
      // ✅ PREPARAR DADOS PARA FIREBASE
      const dataToSave = {
        ...clientData,
        number: await generateClientNumber(), // ✅ GERAR NÚMERO
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "clients"), dataToSave);
      console.log("Cliente criado com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  };

  // ✅ ATUALIZAR CLIENTE
  const updateClient = async (
    id: string,
    clientData: Partial<Client>
  ): Promise<void> => {
    try {
      const clientRef = doc(db, "clients", id);
      await updateDoc(clientRef, {
        ...clientData,
        updatedAt: serverTimestamp(),
      });
      console.log("Cliente atualizado:", id);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  };

  // ✅ DELETAR CLIENTE
  const deleteClient = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "clients", id));
      console.log("Cliente deletado:", id);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  };

  // ✅ GERAR NÚMERO SEQUENCIAL DO CLIENTE
  const generateClientNumber = async (): Promise<string> => {
    try {
      const clientsRef = collection(db, "clients");
      const snapshot = await getDocs(clientsRef);
      const nextNumber = snapshot.size + 1;
      return `CLT-${nextNumber.toString().padStart(3, "0")}`; // CLT-001, CLT-002...
    } catch (error) {
      console.error("Erro ao gerar número do cliente:", error);
      return `CLT-${Date.now()}`; // Fallback
    }
  };

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    generateClientNumber,
  };
}
