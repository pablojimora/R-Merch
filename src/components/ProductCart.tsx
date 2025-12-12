"use client";
import { Product } from "@/app/admin/page";
import Image from "next/image";

const ProductCart = ({imageUrl, name, price, stock}: Product) => {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-4 transition hover:shadow-md">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={imageUrl}
          alt="Producto"
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-[#161C40] line-clamp-1">
          {name}
        </h3>

        <span className="text-[#615CF2] text-base font-bold mt-1">
          ${price}
        </span>

        <div className="flex items-center gap-3 mt-3">
          <button className="h-8 w-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50">
            -
          </button>
          <span className="text-sm font-medium text-gray-700">{stock}</span>
          <button className="h-8 w-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50">
            +
          </button>
        </div>
      </div>

      <button className="text-gray-400 hover:text-red-500 transition text-xl">
        ×
      </button>
    </section>
  );
};

export default ProductCart;
