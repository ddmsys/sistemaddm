'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebase';

export function useFirestore<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints, orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as T,
        );
        setData(items);
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        setError(`Erro ao carregar ${collectionName}`);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName, constraints]);

  const create = async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        created_at: now,
        updated_at: now,
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      throw new Error(`Erro ao criar ${collectionName}`);
    }
  };

  const update = async (id: string, updates: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      throw new Error(`Erro ao atualizar ${collectionName}`);
    }
  };

  const remove = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      throw new Error(`Erro ao excluir ${collectionName}`);
    }
  };

  const getById = async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      throw new Error(`Erro ao carregar ${collectionName}`);
    }
  };

  const checkDuplicate = async (
    field: string,
    value: string,
    excludeId?: string,
  ): Promise<boolean> => {
    try {
      const q = query(collection(db, collectionName), where(field, '==', value));
      const snapshot = await getDocs(q);

      if (excludeId) {
        return snapshot.docs.some((doc) => doc.id !== excludeId);
      }

      return !snapshot.empty;
    } catch (error) {
      console.error(`Error checking duplicate ${collectionName}:`, error);
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    getById,
    checkDuplicate,
  };
}
