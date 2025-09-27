import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-50 h-full p-4">
      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard" className="font-bold">
          Dashboard
        </Link>
        <Link href="/leads">Leads</Link>
        <Link href="/clientes">Clientes</Link>
        <Link href="/projetos">Projetos</Link>
        {/* ... outros menus */}
      </nav>
    </aside>
  );
}
