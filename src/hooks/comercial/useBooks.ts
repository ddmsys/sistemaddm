// src/hooks/books/useBooks.ts

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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

import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import {
  Book,
  BookSpecifications,
  generateCatalogCode,
  ProjectCatalogType,
  validateBookSpecifications,
} from '@/lib/types/books';
import { getUserId } from '@/lib/utils/user-helper';

// ==================== INTERFACES ====================
interface UseBooksOptions {
  clientId?: string;
  catalogType?: ProjectCatalogType;
  realtime?: boolean;
}

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
  createBook: (data: CreateBookData) => Promise<string>;
  updateBook: (id: string, data: Partial<UpdateBookData>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getNextWorkNumber: (clientId: string, type: ProjectCatalogType) => Promise<number>;
}

interface CreateBookData {
  clientId: string;
  clientNumber: number;
  catalogType: ProjectCatalogType;
  title: string;
  subtitle?: string;
  author: string;
  isbn?: string;
  specifications: BookSpecifications;
  referenceFiles?: {
    name: string;
    url: string;
    type: 'pdf' | 'mockup' | 'artwork' | 'other';
  }[];
  notes?: string;
}

interface UpdateBookData {
  title: string;
  subtitle?: string;
  author: string;
  isbn?: string;
  specifications: BookSpecifications;
  referenceFiles?: {
    name: string;
    url: string;
    type: 'pdf' | 'mockup' | 'artwork' | 'other';
    uploadedAt: Timestamp;
  }[];
  notes?: string;
}

// ==================== HOOK ====================
export function useBooks(options: UseBooksOptions = {}): UseBooksReturn {
  const { clientId, catalogType, realtime = true } = options;
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== LOAD BOOKS =====
  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const booksRef = collection(db, 'books');
      const constraints: QueryConstraint[] = [];

      if (clientId) {
        constraints.push(where('clientId', '==', clientId));
      }

      if (catalogType) {
        constraints.push(where('catalogMetadata.type', '==', catalogType));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(booksRef, ...constraints);

      if (realtime) {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const booksData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Book[];

            setBooks(booksData);
            setLoading(false);
          },
          (err) => {
            console.error('Error loading books:', err);
            setError(err.message);
            setLoading(false);
          },
        );

        return () => unsubscribe();
      } else {
        getDocs(q)
          .then((snapshot) => {
            const booksData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Book[];

            setBooks(booksData);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error loading books:', err);
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      console.error('Error setting up books query:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [user, clientId, catalogType, realtime]);

  // ===== GET NEXT WORK NUMBER =====
  const getNextWorkNumber = async (
    targetClientId: string,
    type: ProjectCatalogType,
  ): Promise<number> => {
    try {
      const booksRef = collection(db, 'books');
      const q = query(
        booksRef,
        where('clientId', '==', targetClientId),
        where('catalogMetadata.type', '==', type),
        orderBy('catalogMetadata.workNumber', 'desc'),
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return 1;
      }

      const lastBook = snapshot.docs[0].data() as Book;
      return lastBook.catalogMetadata.workNumber + 1;
    } catch (err) {
      console.error('Error getting next work number:', err);
      throw err;
    }
  };

  // ===== CREATE BOOK =====
  const createBook = async (data: CreateBookData): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // ✅ CORRIGIDO: Validação retorna array
      const validationErrors = validateBookSpecifications(data.specifications);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      const workNumber = await getNextWorkNumber(data.clientId, data.catalogType);
      const catalogCode = generateCatalogCode(data.catalogType, data.clientNumber, workNumber);

      const referenceFilesWithTimestamp = data.referenceFiles?.map((file) => ({
        ...file,
        uploadedAt: Timestamp.now(),
      }));

      const userId = getUserId(user);

      const bookData: Omit<Book, 'id'> = {
        clientId: data.clientId,
        catalogCode,
        catalogMetadata: {
          prefix: 'DDM',
          type: data.catalogType,
          clientNumber: data.clientNumber,
          workNumber,
        },
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
        isbn: data.isbn,
        specifications: data.specifications,
        referenceFiles: referenceFilesWithTimestamp,
        notes: data.notes,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userId,
      };

      const docRef = await addDoc(collection(db, 'books'), bookData);
      return docRef.id;
    } catch (err) {
      console.error('Error creating book:', err);
      throw err;
    }
  };

  // ===== UPDATE BOOK =====
  const updateBook = async (id: string, data: Partial<UpdateBookData>): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // ✅ CORRIGIDO: Validação retorna array
      if (data.specifications) {
        const validationErrors = validateBookSpecifications(data.specifications);
        if (validationErrors.length > 0) {
          throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
        }
      }

      const updateData: Partial<Book> = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, updateData);
    } catch (err) {
      console.error('Error updating book:', err);
      throw err;
    }
  };

  // ===== DELETE BOOK =====
  const deleteBook = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const bookRef = doc(db, 'books', id);
      await deleteDoc(bookRef);
    } catch (err) {
      console.error('Error deleting book:', err);
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
    getNextWorkNumber,
  };
}
