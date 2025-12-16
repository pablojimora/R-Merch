"use client";
import { useState, FormEvent } from "react";
import Toast from "./Toast";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({
    show: false,
    type: 'info',
    message: ''
  });

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setToast({ show: true, type, message });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast('warning', 'Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      showToast('error', 'Por favor ingresa un email válido');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        showToast('success', data.message);
        setEmail('');
      } else {
        showToast('error', data.message);
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      showToast('error', 'Error al procesar la suscripción. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="mt-12 mb-24 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <h3 className="text-xl font-bold text-[#161C40]">Únete a la comunidad RIWI</h3>
          <p className="max-w-2xl text-gray-600">
            Suscríbete para recibir noticias, lanzamientos exclusivos y ofertas especiales de R-Merch.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-md gap-2">
            <input
              type="email"
              aria-label="email"
              placeholder="Tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-[#615CF2] px-6 py-3 text-white font-semibold hover:bg-[#4e49d9] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Suscribirse'}
            </button>
          </form>
        </div>
      </section>

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
}
