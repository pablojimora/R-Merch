"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  const { _id, name, price, images, stock, ownerId } = product;
  const hasStock = stock === undefined || stock > 0;

  return (
    <article className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={_id ? `/products/${_id}` : "#"} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {images && images.length > 0 ? (
            <Image 
              src={images[0]} 
              alt={name} 
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Stock Badge */}
          {!hasStock && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              Agotado
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-[#161C40] line-clamp-2 mb-2 group-hover:text-[#615CF2] transition-colors">
            {name}
          </h3>
          
          <div className="flex items-end justify-between mt-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Precio</div>
              <div className="text-2xl font-bold text-[#615CF2]">${Number(price).toLocaleString('es-CO')} COP</div>
            </div>
            
            <button 
              disabled={!hasStock}
              className="px-5 py-2.5 bg-gradient-to-r from-[#615CF2] to-[#4e49d9] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {hasStock ? "Agregar" : "Agotado"}
            </button>
          </div>
          
          {/* Low stock warning */}
          {stock !== undefined && stock < 5 && stock > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              ¡Solo quedan {stock} unidades!
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
