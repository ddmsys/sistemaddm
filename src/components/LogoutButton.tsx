'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { auth } from '@/lib/firebase';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
      alert('Logout realizado com sucesso');
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      alert('Erro ao fazer logout');
    }
  }

  return (
    <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">
      Sair
    </button>
  );
}
