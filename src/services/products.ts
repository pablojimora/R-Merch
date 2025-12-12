import { AddToCartPayload } from "@/dto/payload.card.types";
import axios from "axios";

export const addToCart = async (payload: AddToCartPayload) => {
    const data = await axios.post('/api/cart', payload);
    return data;
}

export const getCardProducts = async (userId: string) => {
    const { data } = await axios.get(`/api/cart?userId=${userId}`);
    return data;
}

export const updateCartProduct = async (userId: string, productId: string, quantity: number) => {
  return axios.put("/api/cart", { userId, productId, quantity });
};

export const deleteCartProduct = async (userId: string, productId: string) => {
  return axios.delete(`/api/cart?userId=${userId}&productId=${productId}`);
};

// Utilidad para obtener el userId desde localStorage
export function getUserIdFromLocalStorage() {
    if (typeof window !== "undefined") {
        const user = JSON.parse(localStorage.getItem("rmerch_user") || "{}");
        return user.id;
    }
    return undefined;
}