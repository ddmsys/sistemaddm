'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: '🏠',
    },
    {
      name: 'Leads',
      href: '/crm/leads',
      icon: '🎯',
    },
    {
      name: 'Clientes', // ✅ ADICIONADO
      href: '/crm/clients',
      icon: '🏢',
    },
    {
      name: 'Orçamentos',
      href: '/crm/quotes',
      icon: '📄',
    },
    {
      name: 'Projetos',
      href: '/crm/projects',
      icon: '🚀',
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-900">DDM Sistema</h1>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-6 py-3 text-sm font-medium transition-colors hover:bg-slate-50',
                pathname === item.href
                  ? 'border-r-2 border-blue-600 bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:text-slate-900',
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
