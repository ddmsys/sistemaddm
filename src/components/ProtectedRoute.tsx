// src/components/ProtectedRoute.tsx
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';

interface Props {
  adminOnly?: boolean;
  children: React.ReactNode;
}

export default function ProtectedRoute({ adminOnly = false, children }: Props) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (adminOnly && role !== 'admin') router.push('/unauthorized');
    }
  }, [user, loading, role, router, adminOnly]);

  if (loading || !user) return <p>Carregando...</p>;
  if (adminOnly && role !== 'admin') return <p>Acesso negado</p>;

  return <>{children}</>;
}
