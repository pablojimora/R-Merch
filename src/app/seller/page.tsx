"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SellerPage() {
  return (
    <ProtectedRoute>
      <SellerContent />
    </ProtectedRoute>
  );
}

function SellerContent() {
  const { user } = useAuth();

  // Verificar que sea vendedor
  if (user?.role !== 'seller') {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-[#161C40]">Acceso Denegado</h1>
        <p className="mt-2 text-gray-600">Solo los vendedores pueden acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#161C40]">Panel de Vendedor</h1>
        <p className="mt-2 text-gray-600">Bienvenido {user.name}, gestiona tus productos desde aquí</p>
      </div>

      {/* Cards de acciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/seller/products/list"
          className="rounded-lg border-2 border-gray-200 bg-white p-6 hover:border-[#615CF2] hover:shadow-lg transition group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#615CF2]/10 flex items-center justify-center group-hover:bg-[#615CF2] transition">
              <svg className="h-6 w-6 text-[#615CF2] group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#161C40]">Mis Productos</h3>
              <p className="text-sm text-gray-600">Ver y gestionar</p>
            </div>
          </div>
        </Link>

        <Link
          href="/seller/products/create"
          className="rounded-lg border-2 border-gray-200 bg-white p-6 hover:border-green-600 hover:shadow-lg transition group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition">
              <svg className="h-6 w-6 text-green-600 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#161C40]">Crear Producto</h3>
              <p className="text-sm text-gray-600">Agregar nuevo</p>
            </div>
          </div>
        </Link>

        <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#161C40]">Estadísticas</h3>
              <p className="text-sm text-gray-600">Próximamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 rounded-md bg-blue-50 border border-blue-200 p-4">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Gestión de Productos</p>
            <p className="text-blue-700">
              Como vendedor, puedes crear, editar y eliminar tus propios productos. Solo tú y los administradores pueden ver y modificar los productos que has creado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
