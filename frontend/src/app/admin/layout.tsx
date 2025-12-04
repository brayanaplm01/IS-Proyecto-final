"use client";

import Link from "next/link";
import { useAuth } from "@/AuthContext";
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  Square2StackIcon, 
  TagIcon, 
  FolderIcon, 
  UsersIcon,
  HomeIcon,
  ArrowLeftEndOnRectangleIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#e5e7eb]">
      <aside className="w-20 hover:w-64 bg-[#232946] text-white flex flex-col p-6 gap-4 shadow-2xl border-r border-[#232946] transition-all duration-300 ease-in-out group">
        <div className="text-3xl font-bold mb-10 tracking-wide text-[#eebbc3] overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dashboard</div>
        {user && (
          <div className="text-lg font-semibold text-gray-300 mb-6 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {user.nombre || user.correo}
          </div>
        )}
        <nav className="flex flex-col gap-4 text-lg font-medium">
          {isMounted && (
            <>
              <Link href="/admin" className="flex items-center gap-2 hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">
                <ChartBarIcon className="h-6 w-6" /> Panel general
              </Link>
              <Link href="/admin/ordenes" className="flex items-center gap-2 hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">
                <ArchiveBoxIcon className="h-6 w-6" /> Órdenes
              </Link>
              <Link href="/admin/productos" className="flex items-center gap-2 hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">
                <Square2StackIcon className="h-6 w-6" /> Productos
              </Link>
              <Link href="/admin/marcas" className="flex items-center gap-2 hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">
                <TagIcon className="h-6 w-6" /> Marcas
              </Link>
              <Link href="/admin/categorias" className="flex items-center gap-2 hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">
                <FolderIcon className="h-6 w-6" /> Categorias
              </Link>
              <Link href="/admin/clientes" className="flex items-center gap-2 hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">
                <UsersIcon className="h-6 w-6" /> Clientes
              </Link>
              <Link href="/" className="flex items-center gap-2 hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">
                <HomeIcon className="h-6 w-6" /> Inicio
              </Link>
            </>
          )}
        </nav>
        <div className="flex-1" />
        <div className="mt-auto mb-4 text-lg font-medium">
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full text-left hover:text-[#eebbc3] transition whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300"
          >
            <span className="flex items-center gap-2"><ArrowLeftEndOnRectangleIcon className="h-6 w-6" /> Cerrar Sesión</span>
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-8 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 duration-300">&copy; 2024 SCAM</div>
      </aside>
      <main className="flex-1 min-h-screen bg-[#e5e7eb] p-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
} 