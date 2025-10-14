'use client';

import { Dialog, Transition } from '@headlessui/react';
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  DollarSign,
  FileText,
  Globe,
  Megaphone,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: number;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
    roles: ['admin', 'comercial', 'producao', 'financeiro', 'compras', 'logistica', 'marketing'],
  },
  {
    name: 'CRM/Comercial',
    href: '/crm',
    icon: Users,
    roles: ['admin', 'comercial'],
    children: [
      {
        name: 'Dashboard',
        href: '/crm',
        icon: BarChart3,
        roles: ['admin', 'comercial'],
      },
      {
        name: 'Leads',
        href: '/crm/leads',
        icon: Users,
        roles: ['admin', 'comercial'],
      },
      {
        name: 'Orçamentos',
        href: '/crm/quotes',
        icon: FileText,
        roles: ['admin', 'comercial'],
      },
      {
        name: 'Projetos',
        href: '/crm/projects',
        icon: Briefcase,
        roles: ['admin', 'comercial'],
      },
      {
        name: 'Clientes',
        href: '/crm/clients',
        icon: Users,
        roles: ['admin', 'comercial'],
      }, // ✅ FECHAR O OBJETO ANTERIOR
      {
        name: 'Produtos',
        href: '/products',
        icon: Package,
        roles: ['admin', 'comercial'], // ✅ ADICIONAR roles
      },
    ],
  },
  {
    name: 'Produção',
    href: '/production',
    icon: Briefcase,
    roles: ['admin', 'producao'],
    children: [
      {
        name: 'Dashboard',
        href: '/production',
        icon: BarChart3,
        roles: ['admin', 'producao'],
      },
      {
        name: 'Fila de Produção',
        href: '/production/queue',
        icon: Briefcase,
        roles: ['admin', 'producao'],
      },
      {
        name: 'Provas',
        href: '/production/proofs',
        icon: FileText,
        roles: ['admin', 'producao'],
      },
      {
        name: 'Qualidade',
        href: '/production/quality',
        icon: Settings,
        roles: ['admin', 'producao'],
      },
    ],
  },
  {
    name: 'Financeiro',
    href: '/finance',
    icon: DollarSign,
    roles: ['admin', 'financeiro'],
    children: [
      {
        name: 'Dashboard',
        href: '/finance',
        icon: BarChart3,
        roles: ['admin', 'financeiro'],
      },
      {
        name: 'Faturas',
        href: '/finance/invoices',
        icon: FileText,
        roles: ['admin', 'financeiro'],
      },
      {
        name: 'Contas a Receber',
        href: '/finance/receivables',
        icon: DollarSign,
        roles: ['admin', 'financeiro'],
      },
    ],
  },
  {
    name: 'Compras',
    href: '/purchases',
    icon: ShoppingCart,
    roles: ['admin', 'compras'],
    children: [
      {
        name: 'Dashboard',
        href: '/purchases',
        icon: BarChart3,
        roles: ['admin', 'compras'],
      },
      {
        name: 'Fornecedores',
        href: '/purchases/suppliers',
        icon: Users,
        roles: ['admin', 'compras'],
      },
      {
        name: 'Pedidos',
        href: '/purchases/orders',
        icon: ShoppingCart,
        roles: ['admin', 'compras'],
      },
    ],
  },
  {
    name: 'Logística',
    href: '/logistics',
    icon: Truck,
    roles: ['admin', 'logistica'],
    children: [
      {
        name: 'Dashboard',
        href: '/logistics',
        icon: BarChart3,
        roles: ['admin', 'logistica'],
      },
      {
        name: 'Envios',
        href: '/logistics/shipments',
        icon: Truck,
        roles: ['admin', 'logistica'],
      },
      {
        name: 'Rastreamento',
        href: '/logistics/tracking',
        icon: Globe,
        roles: ['admin', 'logistica'],
      },
    ],
  },
  {
    name: 'Marketing',
    href: '/marketing',
    icon: Megaphone,
    roles: ['admin', 'marketing'],
    children: [
      {
        name: 'Dashboard',
        href: '/marketing',
        icon: BarChart3,
        roles: ['admin', 'marketing'],
      },
      {
        name: 'Campanhas',
        href: '/marketing/campaigns',
        icon: Megaphone,
        roles: ['admin', 'marketing'],
      },
      {
        name: 'Criativos',
        href: '/marketing/creatives',
        icon: FileText,
        roles: ['admin', 'marketing'],
      },
    ],
  },
  {
    name: 'Portal Cliente',
    href: '/portal',
    icon: Globe,
    roles: ['cliente'],
    children: [
      {
        name: 'Meus Projetos',
        href: '/portal/projects',
        icon: Briefcase,
        roles: ['cliente'],
      },
      {
        name: 'Aprovações',
        href: '/portal/approvals',
        icon: FileText,
        roles: ['cliente'],
      },
      {
        name: 'Histórico',
        href: '/portal/history',
        icon: BarChart3,
        roles: ['cliente'],
      },
    ],
  },
  {
    name: 'Administração',
    href: '/admin',
    icon: Settings,
    roles: ['admin'],
    children: [
      { name: 'Usuários', href: '/admin/users', icon: Users, roles: ['admin'] },
      {
        name: 'Configurações',
        href: '/admin/settings',
        icon: Settings,
        roles: ['admin'],
      },
      { name: 'Logs', href: '/admin/logs', icon: FileText, roles: ['admin'] },
    ],
  },
];

interface SidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ userRole, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavigation = navigation.filter((item) => item.roles.includes(userRole));

  const NavigationItems = ({ items }: { items: NavigationItem[] }) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.children && item.children.some((child) => pathname === child.href));

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-primary-600 hover:bg-primary-100 hover:text-primary-900',
              )}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-500' : 'text-primary-400 group-hover:text-primary-500',
                )}
              />
              {item.name}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  {item.badge}
                </span>
              )}
              {item.children && (
                <ChevronRight
                  className={cn(
                    'ml-auto h-4 w-4 transition-transform',
                    isActive ? 'rotate-90' : '',
                  )}
                />
              )}
            </Link>

            {item.children && isActive && (
              <ul className="mt-1 space-y-1 pl-8">
                {item.children
                  .filter((child) => child.roles.includes(userRole))
                  .map((child) => (
                    <li key={child.name}>
                      <Link
                        href={child.href}
                        className={cn(
                          'group flex items-center rounded-md px-2 py-2 text-sm transition-colors',
                          pathname === child.href
                            ? 'bg-blue-50 font-medium text-blue-700'
                            : 'text-primary-500 hover:bg-primary-50 hover:text-primary-700',
                        )}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                      >
                        <child.icon className="mr-3 h-4 w-4" />
                        {child.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-primary-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                <span className="text-sm font-bold text-white">DDM</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-primary-900">Sistema DDM</span>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              <NavigationItems items={filteredNavigation} />
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={onClose}
                    >
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                      <span className="text-sm font-bold text-white">DDM</span>
                    </div>
                    <span className="ml-2 text-lg font-semibold text-primary-900">Sistema DDM</span>
                  </div>
                  <nav className="mt-8 space-y-1 px-2">
                    <NavigationItems items={filteredNavigation} />
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0"></div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
