import React, { useState } from "react";

interface OrderFormProps {
  initialValues: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    paymentMethod: string;
  };
  loading: boolean;
  onSubmit: (values: any) => void;
  onClose: () => void;
  items?: Array<{ name: string; quantity: number; subtotal: number }>;
  total?: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialValues, loading, onSubmit, onClose, items = [], total = 0 }) => {
  const [form, setForm] = useState(initialValues);
  const [formError, setFormError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.email || !form.phone || !form.street || !form.city || !form.country || !form.paymentMethod) {
      setFormError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-2xl">×</button>
        <h2 className="text-xl font-bold mb-4 text-center">Datos para la orden</h2>
        {/* Subtotales y total */}
        {items.length > 0 && (
          <div className="mb-4">
            <div className="text-base font-semibold mb-2">Resumen de productos:</div>
            <ul className="mb-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm text-gray-700">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold">${item.subtotal}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>
        )}
        <form className="flex flex-col flex-wrap gap-3 w-full max-w-full" onSubmit={handleSubmit}>
          {formError && <div className="text-red-600 text-center text-sm font-semibold">{formError}</div>}
          <div className="flex gap-2 w-full">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Nombre" className="flex-1 border rounded px-3 py-2 w-full max-w-full" />
            <input name="email" value={form.email} onChange={handleChange} required placeholder="Correo" className="flex-1 border rounded px-3 py-2 w-full max-w-full" />
          </div>
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Teléfono" className="border rounded px-3 py-2 w-full max-w-full" />
          <input name="street" value={form.street} onChange={handleChange} required placeholder="Calle" className="border rounded px-3 py-2 w-full max-w-full" />
          <div className="flex gap-2 w-full">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Ciudad" className="flex-1 border rounded px-3 py-2 w-full max-w-full" />
            <input name="country" value={form.country} onChange={handleChange} required placeholder="País" className="flex-1 border rounded px-3 py-2 w-full max-w-full" />
          </div>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="border rounded px-3 py-2 w-full max-w-full">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="paypal">PayPal</option>
            <option value="mercado_pago">Mercado Pago</option>
          </select>
          <button type="submit" disabled={loading} className="mt-4 bg-primary text-white rounded-xl px-4 py-2 text-lg font-bold hover:bg-primary/90 w-full">
            {loading ? "Generando orden..." : "Confirmar orden"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
