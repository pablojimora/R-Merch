"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
}

export default function EditProductPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <EditProductContent />
    </ProtectedRoute>
  );
}

function EditProductContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
          setFormData({
            name: data.product.name,
            description: data.product.description || "",
            price: data.product.price.toString(),
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

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validations
    if (!formData.name || !formData.price) {
      setError("El nombre y el precio son requeridos");
      setSubmitting(false);
      return;
    }

    const price = parseFloat(formData.price);

    if (isNaN(price) || price <= 0) {
      setError("El precio debe ser un número mayor a 0");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Producto actualizado exitosamente");
        router.push("/admin/products/list");
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
          <Link href="/admin/products/list" className="text-[#615CF2] hover:underline">
            Volver a la lista de productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#161C40]">Editar Producto</h1>
        <p className="mt-2 text-gray-600">Actualiza la información del producto</p>
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
              <p><span className="font-medium">ID:</span> {product._id}</p>
              <p><span className="font-medium">Stock actual:</span> {product.stock} unidades</p>
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
              placeholder="Ej: Camiseta RIWI"
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
              placeholder="Describe el producto..."
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Precio (USD) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-3 pl-8 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
                placeholder="0.00"
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
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
          <Link
            href="/admin/products/list"
            className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {/* Warning */}
      <div className="mt-6 rounded-md bg-yellow-50 border border-yellow-200 p-4">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Campos editables limitados</p>
            <p className="text-yellow-700">Solo puedes editar nombre, descripción y precio. Para cambiar stock o imágenes, contacta al administrador del sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
