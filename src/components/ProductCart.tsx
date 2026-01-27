"use client";
import { Product } from "@/app/admin/page";
import Image from "next/image";
import { updateCartProduct, deleteCartProduct, getUserIdFromLocalStorage } from "@/services/products";
import { createOrder } from "@/services/cartToOrder";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import { useCart } from "@/context/CartContext";

const ProductCart = ({ imageUrl, name, price, stock, _id, quantity }: Product) => {
  const router = useRouter();
  const { updateCartCount } = useCart();
  const [editQuantity, setEditQuantity] = useState(quantity || 1);
  const [openReserve, setOpenReserve] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleQuantityChange = async (value: number) => {
    setEditQuantity(value);
    const userId = getUserIdFromLocalStorage();
    if (!userId) return;
    if (!value || value < 1) return;
    try {
      await updateCartProduct(userId, _id, value);
      await updateCartCount();
      router.refresh();
    } catch (err) {
      // Puedes mostrar un toast o alerta si lo deseas
    }
  };

  const handleDelete = async () => {
    const userId = getUserIdFromLocalStorage();
    if (!userId) return alert("Usuario no autenticado");
    if (!confirm("¿Eliminar este producto del carrito?")) return;
    try {
      await deleteCartProduct(userId, _id);
      await updateCartCount();
      setOpenDelete(true);
      router.refresh();
    } catch (err) {
      alert("Error al eliminar el producto");
    }
  };

  return (
    <div className="w-full max-w-sm bg-[#ffffff] p-6 border border-[#6c6c6d] rounded-2xl shadow-2xl">
      <a href="#">
        <Image
          className="rounded-2xl mb-6 border-2 border-[#7a7a7a]"
          src={imageUrl}
          alt={name}
          width={320}
          height={240}
        />
      </a>
      <div>
        <div className="flex items-center space-x-3 mb-6"></div>
        <div className="flex justify-between items-center">
          <a href="#">
            <h5 className="text-xl text-black font-semibold tracking-tight">
              {name}
            </h5>
          </a>
          <span className="text-3xl font-extrabold text-[#62D9AD]">
            ${price}
          </span>
        </div>
        <div className="flex items-center mt-2 mb-2 gap-2">
          <span className="text-sm text-gray-600">Cantidad:</span>
          <input
            type="number"
            min={1}
            max={stock}
            value={editQuantity}
            onChange={e => handleQuantityChange(Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded text-center"
          />
        </div>
        <div className="flex items-center justify-evenly mt-6 gap-2">
          
          <Modal
            title="Producto agendado"
            text="¡Has agendado este producto! Revisa tu carrito para más información."
            open={openReserve}
            onClose={() => setOpenReserve(false)}
          />
          <button
            onClick={handleDelete}
            type="button"
            className="cursor-pointer inline-flex items-center text-white bg-[#615CF2] hover:bg-[#009c75a4] box-border border border-transparent focus:ring-4 focus:ring-red-300/50 shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2 focus:outline-none"
          >
            Eliminar
          </button>
          
          <Modal
            title="Producto eliminado"
            text="El producto ha sido eliminado del carrito."
            open={openDelete}
            onClose={() => setOpenDelete(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
