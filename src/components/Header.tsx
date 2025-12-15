"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const auth = useAuth();

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#615CF2] text-white">
            <span className="font-semibold">R</span>
          </div>
          <div className="text-lg font-semibold text-[#161C40]">
            R-Merch
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#615CF2]">Inicio</Link>
          <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-[#615CF2]">Tienda</Link>
          <Link href="/emprendimientos" className="text-sm font-medium text-gray-700 hover:text-[#615CF2]">Emprendimientos</Link>

          {auth.user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">Hola, <strong>{auth.user.name}</strong></span>
                {auth.isAdmin() && (
                  <span className="rounded-full bg-[#615CF2] px-2 py-0.5 text-xs font-semibold text-white">
                    Admin
                  </span>
                )}
                {auth.user.role === 'seller' && (
                  <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                    Vendedor
                  </span>
                )}
              </div>
              {auth.isAdmin() && (
                <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-[#615CF2]">
                  Panel Admin
                </Link>
              )}
              {auth.user.role === 'seller' && (
                <Link href="/seller" className="text-sm font-medium text-gray-700 hover:text-[#615CF2]">
                  Panel Vendedor
                </Link>
              )}
              <button onClick={() => auth.logout()} className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">Cerrar</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[#615CF2]">Entrar</Link>
              <Link href="/register" className="rounded-full bg-[#615CF2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4e49d9]">Registro</Link>
            </div>
          )}

          <Link href="/cart" className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#161C40] hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44C8.89 16.37 9.5 18 11 18h8v-2h-7.1c-.14 0-.25-.09-.29-.22L12.1 14h5.45c.75 0 1.41-.41 1.75-1.03l3.58-7.59L21.3 3H6.21l-.94-2H1v2h3l3.6 7.59L7 4z"/></svg>
            Carrito
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#62D9AD] text-xs font-medium text-white">0</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
