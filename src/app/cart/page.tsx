"use client"
import { useEffect, useState } from "react";
import { Product } from "../admin/page";
import { getCardProducts, getUserIdFromLocalStorage, updateCartProduct, deleteCartProduct } from "@/services/products";
import Modal from "@/components/Modal";
import { createOrder } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import OrderForm from "@/components/OrderForm";
import Image from "next/image";
import Link from "next/link";

const Cart = () => {
    const [products, setProducts] = useState<any>(null);
    const [openReserve, setOpenReserve] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const { user } = useAuth ? useAuth() : { user: null };
    const { updateCartCount } = useCart();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [form] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      street: "",
      city: "",
      country: "",
      paymentMethod: "efectivo"
    });

    useEffect(() => {
        const cartProducts = async () => {
            const userId = getUserIdFromLocalStorage();
            if (!userId) return;
            const { data } = await getCardProducts(userId);
            // Filtrar items con productId null (productos eliminados)
            if (data && data.items) {
                data.items = data.items.filter((item: any) => item.productId !== null);
            }
            setProducts(data)
        }
        cartProducts();
    }, [refreshKey])

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
      const userId = getUserIdFromLocalStorage();
      if (!userId || newQuantity < 1) return;
      try {
        await updateCartProduct(userId, productId, newQuantity);
        setRefreshKey(prev => prev + 1);
        await updateCartCount();
      } catch (err) {
        alert("Error al actualizar cantidad");
      }
    };

    const handleDelete = async (productId: string) => {
      const userId = getUserIdFromLocalStorage();
      if (!userId) return alert("Usuario no autenticado");
      if (!confirm("¿Eliminar este producto del carrito?")) return;
      try {
        await deleteCartProduct(userId, productId);
        setRefreshKey(prev => prev + 1);
        await updateCartCount();
      } catch (err) {
        alert("Error al eliminar el producto");
      }
    };

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
      const items = products.items
        .filter((item: any) => item.productId && item.productId._id)
        .map((item: any) => ({
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
        setRefreshKey(prev => prev + 1);
        await updateCartCount();
      } catch (err) {
        alert("Error al generar la orden");
      } finally {
        setLoading(false);
      }
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Link href="/" className="hover:text-[#615CF2]">Inicio</Link>
                <span>/</span>
                <span>Carrito</span>
              </div>
              <h1 className="text-3xl font-bold text-[#161C40]">Mi Carrito</h1>
              <p className="mt-2 text-gray-600">
                {products && products.items && products.items.length > 0 
                  ? `${products.items.length} producto${products.items.length > 1 ? 's' : ''} en tu carrito`
                  : 'Tu carrito está vacío'
                }
              </p>
            </div>

            {products && products.items && products.items.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-4">
                  {products.items.filter((item: any) => item.productId).map((item: any) => (
                    <div key={item.productId._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-6">
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0">
                          <Link href={`/products/${item.productId._id}`}>
                            <Image
                              src={item.image || item.productId.images?.[0] || '/placeholder.png'}
                              alt={item.name}
                              width={120}
                              height={120}
                              className="rounded-lg object-cover border border-gray-200 hover:opacity-80 transition"
                            />
                          </Link>
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link href={`/products/${item.productId._id}`}>
                              <h3 className="text-lg font-semibold text-[#161C40] hover:text-[#615CF2] transition">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                              Stock disponible: {item.productId.stock} unidades
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Control de cantidad */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600">Cantidad:</span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  max={item.productId.stock}
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.productId._id, Number(e.target.value))}
                                  className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none"
                                />
                                <button
                                  onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                                  disabled={item.quantity >= item.productId.stock}
                                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Precio */}
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#615CF2]">
                                ${Number(item.price * item.quantity).toLocaleString('es-CO')} COP
                              </p>
                              <p className="text-sm text-gray-500">
                                ${Number(item.price).toLocaleString('es-CO')} COP c/u
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => handleDelete(item.productId._id)}
                          className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                          title="Eliminar del carrito"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen del pedido */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-[#161C40] mb-6">Resumen del Pedido</h2>
                    
                    <div className="space-y-3 mb-6">
                      {products.items.filter((item: any) => item.productId).map((item: any) => (
                        <div key={item.productId._id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            ${Number(item.price * item.quantity).toLocaleString('es-CO')} COP
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">
                          ${Number(products.total).toLocaleString('es-CO')} COP
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Envío</span>
                        <span className="font-medium text-green-600">Gratis</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                        <span className="text-[#161C40]">Total</span>
                        <span className="text-[#615CF2]">
                          ${Number(products.total).toLocaleString('es-CO')} COP
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenOrderForm}
                      className="w-full bg-gradient-to-r from-[#615CF2] to-[#4e49d9] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Proceder al Pago
                    </button>

                    <div className="mt-6 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Envío gratis en todos los pedidos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Compra 100% segura</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <svg className="h-24 w-24 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-600 mb-6">¡Agrega productos para comenzar tu compra!</p>
                <Link 
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#615CF2] to-[#4e49d9] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Explorar Productos
                </Link>
              </div>
            )}

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
          </div>
        </div>
    );
}

export default Cart;