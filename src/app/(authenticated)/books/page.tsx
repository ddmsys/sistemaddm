'use client';

import { BookOpen, Filter, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useBooks } from '@/hooks/comercial/useBooks';
import { useAuth } from '@/hooks/useAuth';
import { Book, ProjectCatalogType } from '@/lib/types/books';

export default function BooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { books, loading } = useBooks({ realtime: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Faça login para continuar</p>
      </div>
    );
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.catalogCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || book.catalogMetadata.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: books.length,
    livros: books.filter((b) => b.catalogMetadata.type === ProjectCatalogType.BOOK).length,
    ebooks: books.filter((b) => b.catalogMetadata.type === ProjectCatalogType.EBOOK).length,
    kindle: books.filter((b) => b.catalogMetadata.type === ProjectCatalogType.KINDLE).length,
  };

  const typeLabels: Record<string, string> = {
    L: 'Livro',
    E: 'E-book',
    K: 'Kindle',
    C: 'CD',
    D: 'DVD',
    G: 'Gráfica',
    P: 'Plataforma',
    S: 'Single',
    X: 'Terceiros',
    A: 'Arte/Design',
    CUSTOM: 'Customizado',
  };

  const typeColors: Record<string, string> = {
    L: 'bg-blue-100 text-blue-800',
    E: 'bg-purple-100 text-purple-800',
    K: 'bg-orange-100 text-orange-800',
    C: 'bg-pink-100 text-pink-800',
    D: 'bg-red-100 text-red-800',
    G: 'bg-green-100 text-green-800',
    P: 'bg-indigo-100 text-indigo-800',
    S: 'bg-yellow-100 text-yellow-800',
    X: 'bg-gray-100 text-gray-800',
    A: 'bg-teal-100 text-teal-800',
    CUSTOM: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Catálogo de Livros</h1>
        <button
          onClick={() => router.push('/books/new')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo Livro
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Livros</p>
              <p className="text-2xl font-bold">{stats.livros}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">E-books</p>
              <p className="text-2xl font-bold">{stats.ebooks}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Kindle</p>
              <p className="text-2xl font-bold">{stats.kindle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, autor ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border py-2 pl-10 pr-4"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border py-2 pl-10 pr-4"
            >
              <option value="all">Todos os tipos</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <p className="text-gray-600">Nenhum livro encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book: Book) => (
            <div
              key={book.id}
              onClick={() => router.push(`/books/${book.id}`)}
              className="cursor-pointer rounded-lg border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        typeColors[book.catalogMetadata.type]
                      }`}
                    >
                      {typeLabels[book.catalogMetadata.type]}
                    </span>
                    <span className="text-xs text-gray-500">{book.catalogCode}</span>
                  </div>
                  <h3 className="line-clamp-2 text-lg font-semibold">{book.title}</h3>
                  {book.subtitle && (
                    <p className="line-clamp-1 text-sm text-gray-600">{book.subtitle}</p>
                  )}
                </div>
              </div>

              <p className="mb-3 text-sm text-gray-700">
                <span className="font-medium">Autor:</span> {book.author}
              </p>

              {book.isbn && (
                <p className="mb-3 text-xs text-gray-500">
                  <span className="font-medium">ISBN:</span> {book.isbn}
                </p>
              )}

              <div className="space-y-1 border-t pt-3 text-xs text-gray-600">
                <p>
                  <span className="font-medium">Formato:</span> {book.specifications.format}
                </p>
                <p>
                  <span className="font-medium">Páginas:</span>{' '}
                  {book.specifications.interior.pageCount}
                </p>
                <p>
                  <span className="font-medium">Encadernação:</span> {book.specifications.binding}
                </p>
              </div>

              <div className="mt-3 border-t pt-3 text-xs text-gray-500">
                Criado em {book.createdAt.toDate().toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
