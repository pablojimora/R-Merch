"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (!res.success) setError(res.message || "Error");
    else router.push("/");
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-semibold text-[#161C40]">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Correo" 
          type="email"
          required
          className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20" 
        />
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          type="password" 
          placeholder="Contraseña" 
          required
          className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20" 
        />
        {error && <div className="text-sm text-[#F25D50] bg-red-50 p-3 rounded-md">{error}</div>}
        <button className="mt-2 rounded-md bg-[#615CF2] px-4 py-3 text-white font-semibold hover:bg-[#4e49d9] transition">Entrar</button>
      </form>
    </div>
  );
}
