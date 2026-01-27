"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function EmprendimientosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        type: "sellers", // Solo productos de vendedores
        ...(search && { search }),
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchProducts();
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#161C40]">Emprendimientos RIWI</h1>
        <p className="mt-2 text-gray-600">Descubre productos únicos creados por nuestra comunidad de vendedores</p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Apoya a los emprendedores de RIWI</p>
            <p className="text-green-700">
              Cada compra apoya directamente a los vendedores de nuestra comunidad. Productos únicos y de calidad.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar emprendimientos..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
          />
          <button
            type="submit"
            className="rounded-md bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Results info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {loading ? "Cargando..." : `${total} productos de emprendedores encontrados`}
        </p>
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            className="text-sm text-green-600 hover:underline"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
              <div className="aspect-[4/3] mb-3 w-full rounded-md bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
              <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                Emprendedor
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No se encontraron emprendimientos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search
              ? `No hay productos que coincidan con "${search}"`
              : "Aún no hay productos de emprendedores disponibles"}
          </p>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Ver todos los emprendimientos
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show first page, last page, current page, and pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      page === pageNum
                        ? "bg-green-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === page - 2 || pageNum === page + 2) {
                return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">¿Eres emprendedor?</h2>
        <p className="mb-4 text-green-100">
          Únete a nuestra comunidad de vendedores y comparte tus productos con la familia RIWI
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-green-600 font-semibold hover:bg-green-50 transition"
        >
          Regístrate ahora
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
