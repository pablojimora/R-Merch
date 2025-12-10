"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  const { _id, name, price, images, stock } = product;
  const hasStock = stock === undefined || stock > 0;

  return (
    <article className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link href={_id ? `/products/${_id}` : "#"} className="block">
        <div className="aspect-[4/3] mb-3 w-full overflow-hidden rounded-md bg-gray-100">
          {images && images.length > 0 ? (
            <Image 
              src={images[0]} 
              alt={name} 
              width={400} 
              height={300} 
              className="h-full w-full object-cover transition group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">Sin imagen</div>
          )}
        </div>

        <h3 className="text-sm font-semibold text-[#161C40] line-clamp-2 group-hover:text-[#615CF2] transition">{name}</h3>
      </Link>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="text-lg font-bold text-[#615CF2]">${Number(price).toFixed(2)}</div>
        <button 
          disabled={!hasStock}
          className="rounded-full bg-[#615CF2] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4e49d9] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasStock ? "Añadir" : "Agotado"}
        </button>
      </div>
      
      {stock !== undefined && stock < 5 && stock > 0 && (
        <p className="mt-1 text-xs text-orange-600">Solo quedan {stock}</p>
      )}
    </article>
  );
}
