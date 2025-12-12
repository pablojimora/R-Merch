import { Product } from "@/app/admin/page"
import axios from "axios"

export const addToCart = async (product: Product) => {
    const data = await axios.post('/api/cart', product);
    return data;
}

export const getCardProducts = async () => {
    const data = await axios.get('/api/cart');
    return data;
}