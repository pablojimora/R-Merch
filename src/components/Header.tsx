"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const auth = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 transition-transform group-hover:scale-105">
              <Image 
                src="/RiwiLogo.png" 
                alt="RIWI Logo" 
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#161C40] leading-tight">R-Merch</span>
              <span className="text-xs text-gray-500 leading-tight">by RIWI</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#615CF2] hover:bg-[#615CF2]/5 rounded-lg transition"
            >
              Inicio
            </Link>
            <Link 
              href="/shop" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#615CF2] hover:bg-[#615CF2]/5 rounded-lg transition"
            >
              Tienda Official
            </Link>
            <Link 
              href="/emprendimientos" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#615CF2] hover:bg-[#615CF2]/5 rounded-lg transition"
            >
              Emprendimientos
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {auth.user ? (
              <>
                {/* User Info */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#615CF2] to-[#4e49d9] flex items-center justify-center text-white text-sm font-semibold">
                    {auth.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                  {auth.isAdmin() && (
                    <span className="px-2 py-0.5 bg-[#615CF2] text-white text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                {/* Panel Links */}
                {auth.isAdmin() && (
                  <Link 
                    href="/admin" 
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#615CF2] hover:bg-[#615CF2]/5 rounded-lg transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Panel
                  </Link>
                )}
                {auth.user.role === 'seller' && (
                  <Link 
                    href="/seller" 
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#615CF2] hover:bg-[#615CF2]/5 rounded-lg transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Mi Tienda
                  </Link>
                )}

                {/* Cart Button */}
                <Link 
                  href="/cart" 
                  className="relative flex items-center gap-2 px-4 py-2 bg-[#615CF2] text-white rounded-lg hover:bg-[#4e49d9] transition shadow-sm"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-medium">Carrito</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-[#2BD968] text-white text-xs font-bold rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={() => auth.logout()} 
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Cerrar sesión"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#615CF2] hover:bg-[#615CF2]/5 rounded-lg transition"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 bg-gradient-to-r from-[#615CF2] to-[#4e49d9] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition"
                >
                  Registro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
