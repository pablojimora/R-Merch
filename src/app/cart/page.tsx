import { useEffect, useState } from "react";
import { Product } from "../admin/page";
import { getCardProducts } from "@/services/products";
import ProductCart from "@/components/ProductCart";

const Cart = () => {
    const [products, setProducts] = useState<Product>();
    useEffect(() => {
        const cartProducts = async () => {
            const { data } = await getCardProducts();
            setProducts(data)
        }

        cartProducts();
    }, [])
    return(
        <>
        <div>
            <ProductCart
                _id={products?._id ?? ""}
                name={products?.name ?? ""}
                price={products?.price ?? 0}
                stock={products?.stock ?? 0}
                imageUrl={products?.imageUrl ?? ""}
            />
        </div>
        </>
    );
}

export default Cart;