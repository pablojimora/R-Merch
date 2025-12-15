"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export interface Product {
  _id: string;
  userId?: string;
  name: string;
  price: number;
  stock: number;
  quantity?: number;
  images?: string[];
  imageUrl: string;
  subtotal?: string;
  productId?: string;
}

interface User {
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch("/api/products?limit=5");
        const productsData = await productsRes.json();
        if (productsData.success) {
          setProducts(productsData.data);
        }

        // Mock users (ya que están hardcodeados)
        setUsers([
          { name: "Pablo Mora", email: "pablo@riwi.io", role: "user" },
          { name: "Duque", email: "duque@riwi.io", role: "admin" }
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#161C40]">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">Bienvenido, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link 
          href="/admin/products/list"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productos Activos</p>
              <p className="text-2xl font-bold text-[#161C40]">
                {loading ? "..." : products.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#615CF2]/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-[#615CF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </Link>

        <Link 
          href="/admin/orders"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Órdenes</p>
              <p className="text-2xl font-bold text-[#161C40]">--</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#62D9AD]/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-[#62D9AD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link 
          href="/admin/users"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuarios Registrados</p>
              <p className="text-2xl font-bold text-[#161C40]">{users.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#2BD968]/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-[#2BD968]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#161C40] mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/products/list"
            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition text-center"
          >
            <div className="h-10 w-10 rounded-full bg-[#615CF2]/10 flex items-center justify-center mx-auto mb-2">
              <svg className="h-5 w-5 text-[#615CF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Gestionar Productos</p>
          </Link>

          <Link 
            href="/admin/orders"
            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition text-center"
          >
            <div className="h-10 w-10 rounded-full bg-[#62D9AD]/10 flex items-center justify-center mx-auto mb-2">
              <svg className="h-5 w-5 text-[#62D9AD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Ver Órdenes</p>
          </Link>

          <Link 
            href="/admin/settings"
            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition text-center"
          >
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Configuración</p>
          </Link>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-[#615CF2]/20 bg-[#615CF2]/5 p-6">
        <div className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-full bg-[#615CF2] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#161C40] mb-1">Panel de Administración</h3>
            <p className="text-sm text-gray-600">
              Estás en el panel de administración. Solo los administradores pueden acceder a esta sección. 
              Aquí podrás gestionar productos, ver órdenes, y configurar la tienda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
