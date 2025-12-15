"use client";

import { modalProps } from "@/dto/modal.types";

export default function Modal({ open, onClose, title, text }: modalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white text-gray-800 w-full max-w-lg rounded-2xl border border-gray-200 p-8 shadow-xl">

        {/* Icono superior */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-3xl font-bold">✓</span>
          </div>
        </div>

        {/* Contenido */}
        <h2 className="text-center text-xl font-semibold mt-8">
          {title}
        </h2>

        <p className="text-center text-gray-500 mt-3 px-2">
          {text}
        </p>

        {/* Botones */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="w-1/2 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
