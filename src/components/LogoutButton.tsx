"use client";

import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={onLogout}
      className="px-2 py-1 bg-red-600 text-white rounded"
    >
      Sair
    </button>
  );
}
