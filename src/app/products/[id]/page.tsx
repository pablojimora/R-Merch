"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        // Product not found
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`Añadido al carrito: ${quantity} x ${product.name}`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Producto no encontrado</h2>
        <p className="mt-2 text-gray-600">El producto que buscas no existe o fue eliminado</p>
        <Link 
          href="/shop" 
          className="mt-6 inline-block rounded-md bg-[#615CF2] px-6 py-3 text-white font-semibold hover:bg-[#4e49d9]"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const hasStock = product.stock === undefined || product.stock > 0;
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#615CF2]">Inicio</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#615CF2]">Tienda</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images Gallery */}
        <div>
          {/* Main Image */}
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition ${
                    selectedImage === idx
                      ? "border-[#615CF2]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-[#161C40] mb-2">{product.name}</h1>
          
          {/* Price */}
          <div className="mb-4">
            <span className="text-3xl font-bold text-[#615CF2]">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {hasStock ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#2BD968]"></span>
                <span className="text-sm text-gray-600">
                  {product.stock !== undefined 
                    ? `En stock (${product.stock} disponibles)`
                    : "En stock"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#F25D50]"></span>
                <span className="text-sm text-gray-600">Agotado</span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#161C40] mb-2">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          {hasStock && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 999}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-20 rounded-md border border-gray-300 text-center focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                  className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!hasStock}
              className="flex-1 rounded-md bg-[#615CF2] px-6 py-4 text-white font-semibold hover:bg-[#4e49d9] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasStock ? "Añadir al carrito" : "Agotado"}
            </button>
            <button className="h-14 w-14 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Envío gratis en compras superiores a $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Garantía de calidad RIWI</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>Devoluciones hasta 30 días</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Shop */}
      <div className="mt-12">
        <Link 
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#615CF2]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
