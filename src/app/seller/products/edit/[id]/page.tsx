"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  ownerId?: string;
}

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProductContent />
    </ProtectedRoute>
  );
}

function EditProductContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Verificar que sea vendedor
  if (user?.role !== 'seller') {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-[#161C40]">Acceso Denegado</h1>
        <p className="mt-2 text-gray-600">Solo los vendedores pueden editar productos.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success) {
          // Verificar que el producto pertenece al vendedor
          if (data.product.ownerId !== user.id) {
            setError("No tienes permiso para editar este producto");
            setLoading(false);
            return;
          }

          setProduct(data.product);
          setFormData({
            name: data.product.name,
            description: data.product.description || "",
            price: data.product.price.toString(),
            stock: data.product.stock.toString(),
          });
        } else {
          setError("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchProduct();
    }
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!formData.name || !formData.price || !formData.stock) {
      setError("Todos los campos son requeridos");
      setSubmitting(false);
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (isNaN(price) || price <= 0) {
      setError("El precio debe ser un número mayor a 0");
      setSubmitting(false);
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError("El stock debe ser un número mayor o igual a 0");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price,
        stock,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Producto actualizado exitosamente");
        router.push("/seller/products/list");
      } else {
        setError(data.message || "Error al actualizar producto");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Error al actualizar producto");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#615CF2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="py-8 max-w-3xl mx-auto">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <svg className="h-16 w-16 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <Link href="/seller/products/list" className="text-[#615CF2] hover:underline">
            Volver a mis productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/seller" className="hover:text-[#615CF2]">Panel Vendedor</Link>
          <span>/</span>
          <Link href="/seller/products/list" className="hover:text-[#615CF2]">Mis Productos</Link>
          <span>/</span>
          <span>Editar</span>
        </div>
        <h1 className="text-3xl font-bold text-[#161C40]">Editar Producto</h1>
        <p className="mt-2 text-gray-600">Actualiza la información de tu producto</p>
      </div>

      {/* Current Product Info */}
      {product && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Información actual</h3>
          <div className="flex gap-4">
            {product.images && product.images.length > 0 && (
              <div className="flex-shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Nombre:</span> {product.name}</p>
              <p><span className="font-medium">Stock actual:</span> {product.stock} unidades</p>
              <p><span className="font-medium">Precio actual:</span> ${Number(product.price).toLocaleString('es-CO')} COP</p>
              <p><span className="font-medium">Imágenes:</span> {product.images?.length || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Precio (COP) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="price"
                  required
                  step="1"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 pl-8 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
                  placeholder="Ej: 50000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="stock"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-md bg-[#615CF2] px-6 py-3 text-white font-semibold hover:bg-[#4e49d9] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Actualizando..." : "Actualizar Producto"}
          </button>
          <Link
            href="/seller/products/list"
            className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {/* Info */}
      <div className="mt-6 rounded-md bg-blue-50 border border-blue-200 p-4">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Nota:</p>
            <p className="text-blue-700">
              Las imágenes del producto no se pueden editar desde esta página. Si necesitas cambiar las imágenes, contacta al administrador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
