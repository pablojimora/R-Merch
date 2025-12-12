"use client"
import { useEffect, useState } from "react";
import { Product } from "../admin/page";
import { getCardProducts, getUserIdFromLocalStorage } from "@/services/products";
import ProductCart from "@/components/ProductCart";
import Modal from "@/components/Modal";
import { createOrder } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import OrderForm from "@/components/OrderForm";

const Cart = () => {
    const [products, setProducts] = useState<any>(null);
    const userId = JSON.parse(localStorage.getItem("rmerch_user") || "{}");
    const [openReserve, setOpenReserve] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const { user } = useAuth ? useAuth() : { user: null };
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [form] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      street: "",
      city: "",
      country: "",
      paymentMethod: "efectivo"
    });

    const handleOpenOrderForm = () => {
      setShowOrderForm(true);
    };
    const handleCloseOrderForm = () => {
      setShowOrderForm(false);
    };
    const handleConfirmOrder = async (formValues: any) => {
      setFormError("");
      const userId = getUserIdFromLocalStorage();
      if (!userId) return alert("Usuario no autenticado");
      if (!products || !products.items || products.items.length === 0) return alert("El carrito está vacío");
      const items = products.items.map((item: any) => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));
      const orderPayload = {
        userId,
        items,
        customer: {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
          address: {
            street: formValues.street,
            city: formValues.city,
            country: formValues.country
          }
        },
        paymentMethod: formValues.paymentMethod
      };
      setLoading(true);
      try {
        await createOrder(orderPayload);
        setShowOrderForm(false);
        setOpenReserve(true);
      } catch (err) {
        alert("Error al generar la orden");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        const cartProducts = async () => {
            const { data } = await getCardProducts(userId.id);
            console.log(data)
            setProducts(data)
        }

        cartProducts();
    }, [])
    return(
        <>
        <section className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center flex-wrap">
            {products && products.items && products.items.length > 0 ? (
                products.items.map((item: any) => (
                    <div key={item.productId._id} className="rounded-2xl m-10">
                        <ProductCart
                            _id={item.productId._id}
                            name={item.name}
                            price={item.price}
                            stock={item.productId.stock}
                            imageUrl={item.image}
                        />
                    </div>
                ))
            ) : (
                <p>Tu carrito está vacío</p>
            )}
            </div>
            <button
                onClick={handleOpenOrderForm}
                type="button"
                className="cursor-pointer inline-flex items-center text-white bg-[#615CF2] hover:bg-[#4e49d9] box-border border border-transparent focus:ring-4 focus:ring-[#615CF2]/50 shadow-xs leading-5 rounded-xl text-2xl px-4 py-2 mt-18 mb-10 focus:outline-none"
              >
                Generar orden
            </button>
            {/* Modal de formulario de orden */}
            {showOrderForm && (
              <OrderForm
                initialValues={form}
                loading={loading}
                onSubmit={handleConfirmOrder}
                onClose={handleCloseOrderForm}
                items={products.items.map((item: any) => ({
                  name: item.name,
                  quantity: item.quantity,
                  subtotal: item.subtotal
                }))}
                total={products.total}
              />
            )}
            <Modal
              title="Orden generada"
              text="¡Tu orden ha sido creada exitosamente! Revisa tu correo para más información."
              open={openReserve}
              onClose={() => setOpenReserve(false)}
            />
        </section>
        </>
    );
}

export default Cart;