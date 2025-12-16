"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
  productId: any;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
  ownerId?: string;
  isOfficial?: boolean;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      country: string;
    };
  };
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function SellerOrdersPage() {
  return (
    <ProtectedRoute>
      <SellerOrdersContent />
    </ProtectedRoute>
  );
}

function SellerOrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [filter, user]);

  const loadOrders = async () => {
    if (!user || user.role !== 'seller') return;
    
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      
      if (data.success) {
        // Filtrar órdenes que contengan productos del vendedor actual
        const sellerOrders = data.data.filter((order: Order) => 
          order.items.some((item: OrderItem) => item.ownerId === user.id)
        );
        setOrders(sellerOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pendiente: "bg-yellow-100 text-yellow-800",
      confirmada: "bg-blue-100 text-blue-800",
      en_preparacion: "bg-purple-100 text-purple-800",
      enviada: "bg-indigo-100 text-indigo-800",
      entregada: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800"
    };
    
    const labels: any = {
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      en_preparacion: "En Preparación",
      enviada: "Enviada",
      entregada: "Entregada",
      cancelada: "Cancelada"
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (user?.role !== 'seller') {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-[#161C40]">Acceso Denegado</h1>
        <p className="mt-2 text-gray-600">Solo los vendedores pueden ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/seller" className="hover:text-[#615CF2]">Panel Vendedor</Link>
          <span>/</span>
          <span>Mis Órdenes</span>
        </div>
        <h1 className="text-3xl font-bold text-[#161C40]">Mis Órdenes</h1>
        <p className="mt-2 text-gray-600">Gestiona las órdenes de tus productos</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "all" 
              ? "bg-[#615CF2] text-white" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Todas ({orders.length})
        </button>
        <button
          onClick={() => setFilter("pendiente")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "pendiente" 
              ? "bg-[#615CF2] text-white" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Pendientes ({orders.filter(o => o.status === "pendiente").length})
        </button>
        <button
          onClick={() => setFilter("confirmada")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "confirmada" 
              ? "bg-[#615CF2] text-white" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Confirmadas ({orders.filter(o => o.status === "confirmada").length})
        </button>
        <button
          onClick={() => setFilter("entregada")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "entregada" 
              ? "bg-[#615CF2] text-white" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Entregadas ({orders.filter(o => o.status === "entregada").length})
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#615CF2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando órdenes...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay órdenes</h3>
          <p className="text-gray-600">No se encontraron órdenes con los filtros seleccionados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            // Calcular el total de productos del vendedor en esta orden
            const sellerItems = order.items.filter(item => item.ownerId === user.id);
            const sellerTotal = sellerItems.reduce((sum, item) => sum + item.subtotal, 0);

            return (
              <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#161C40]">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('es-CO', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Cliente</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Nombre:</span>
                      <span className="ml-2 font-medium">{order.customer.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{order.customer.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="ml-2 font-medium">{order.customer.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Dirección:</span>
                      <span className="ml-2 font-medium">
                        {order.customer.address.street}, {order.customer.address.city}, {order.customer.address.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seller Products */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Mis Productos en esta Orden</h4>
                  <div className="space-y-2">
                    {sellerItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} × ${Number(item.price).toLocaleString('es-CO')} COP
                          </p>
                        </div>
                        <p className="font-semibold text-[#615CF2]">
                          ${Number(item.subtotal).toLocaleString('es-CO')} COP
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Tu total en esta orden</p>
                    <p className="text-2xl font-bold text-[#615CF2]">
                      ${Number(sellerTotal).toLocaleString('es-CO')} COP
                    </p>
                    <p className="text-xs text-gray-500">Método: {order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 rounded-md bg-blue-50 border border-blue-200 p-4">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información sobre tus órdenes</p>
            <p className="text-blue-700">
              Aquí puedes ver todas las órdenes que incluyen tus productos. El administrador gestiona el estado general de la orden, pero tú puedes ver toda la información del cliente y los productos que compraron.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
