"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";
import Toast from "@/components/Toast";

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

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState<{message: string; type: "success" | "error" | "warning" | "info"} | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      
      if (data.success) {
        // Filtrar órdenes que contengan productos oficiales (isOfficial=true o sin ownerId)
        const adminOrders = data.data.filter((order: Order) => 
          order.items.some((item: OrderItem) => item.isOfficial || !item.ownerId)
        );
        setOrders(adminOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setToast({ message: "Estado actualizado exitosamente", type: "success" });
        loadOrders();
      } else {
        const data = await res.json();
        setToast({ message: data.message || "Error al actualizar el estado", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Error al actualizar el estado", type: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const res = await fetch(`/api/orders/${orderToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setToast({ message: "Orden eliminada exitosamente", type: "success" });
        setOrderToDelete(null);
        loadOrders();
      } else {
        setToast({ message: data.message || "Error al eliminar la orden", type: "error" });
        setOrderToDelete(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setToast({ message: "Error de conexión al eliminar la orden", type: "error" });
      setOrderToDelete(null);
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

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/admin" className="hover:text-[#615CF2]">Admin</Link>
          <span>/</span>
          <span>Órdenes Oficiales</span>
        </div>
        <h1 className="text-3xl font-bold text-[#161C40]">Órdenes de Productos Oficiales</h1>
        <p className="mt-2 text-gray-600">Gestiona las órdenes de productos oficiales RIWI</p>
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
          {filteredOrders.map((order) => (
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

              {/* Products */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Productos Oficiales</h4>
                <div className="space-y-2">
                  {order.items
                    .filter(item => item.isOfficial || !item.ownerId)
                    .map((item, idx) => (
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

              {/* Total and Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Total de la orden</p>
                  <p className="text-2xl font-bold text-[#615CF2]">
                    ${Number(order.total).toLocaleString('es-CO')} COP
                  </p>
                  <p className="text-xs text-gray-500">Método: {order.paymentMethod}</p>
                </div>

                {order.status !== "entregada" && order.status !== "cancelada" && (
                  <div className="flex gap-2">
                    {order.status === "pendiente" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "confirmada")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Confirmar
                      </button>
                    )}
                    {order.status === "confirmada" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "en_preparacion")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                      >
                        En Preparación
                      </button>
                    )}
                    {order.status === "en_preparacion" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "enviada")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                      >
                        Enviar
                      </button>
                    )}
                    {order.status === "enviada" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "entregada")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        Marcar Entregada
                      </button>
                    )}
                    <button
                      onClick={() => setOrderToDelete(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Orden</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar esta orden? Se eliminará permanentemente de la base de datos.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Eliminar Orden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
