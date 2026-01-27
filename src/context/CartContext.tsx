"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCardProducts, getUserIdFromLocalStorage } from "@/services/products";

interface CartContextType {
  cartCount: number;
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    const userId = getUserIdFromLocalStorage();
    if (userId) {
      try {
        const res = await getCardProducts(userId);
        const totalQuantity = res.data?.items?.reduce((sum: number, item: any) => {
          // Solo contar items con productId válido
          if (item.productId) {
            return sum + (item.quantity || 0);
          }
          return sum;
        }, 0) || 0;
        setCartCount(totalQuantity);
      } catch (error) {
        console.error("Error updating cart count:", error);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
