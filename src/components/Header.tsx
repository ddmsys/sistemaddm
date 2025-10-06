"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { Bell, Menu as MenuIcon, Search, User } from "lucide-react";
import { Fragment } from "react";

interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export function Header({ onMenuClick, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">DDM</span>
        </div>
        <span className="hidden sm:block text-lg font-semibold text-primary-900">
          Sistema DDM
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Buscar projetos, clientes..."
          leftIcon={<Search className="h-4 w-4" />}
          className="h-9"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            3
          </Badge>
        </div>

        {/* User Menu */}
        {user && (
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex items-center gap-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <User className="h-4 w-4 text-primary-600" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-primary-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-primary-500">{user.role}</p>
                </div>
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/profile"
                      className={cn(
                        "block px-4 py-2 text-sm",
                        active ? "bg-gray-100" : "",
                        "text-gray-700"
                      )}
                    >
                      Meu Perfil
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/settings"
                      className={cn(
                        "block px-4 py-2 text-sm",
                        active ? "bg-gray-100" : "",
                        "text-gray-700"
                      )}
                    >
                      Configurações
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        "block w-full text-left px-4 py-2 text-sm",
                        active ? "bg-gray-100" : "",
                        "text-gray-700"
                      )}
                      onClick={() => {
                        // Handle logout
                      }}
                    >
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </header>
  );
}
