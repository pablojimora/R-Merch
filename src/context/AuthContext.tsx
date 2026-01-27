"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MOCK_USERS from "@/lib/mockUsers";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "seller";
  isActive: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "rmerch_user";
const EXTRA_USERS_KEY = "rmerch_extra_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const loadExtraUsers = () => {
    try {
      const raw = localStorage.getItem(EXTRA_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const saveExtraUsers = (arr: any[]) => {
    localStorage.setItem(EXTRA_USERS_KEY, JSON.stringify(arr));
  };

  const login = async (email: string, password: string) => {
    // search in mocked users and any extra users stored in localStorage
    const extra = loadExtraUsers();
    const all = [...MOCK_USERS, ...extra];
    const found = all.find((u: any) => u.email === email && u.password === password);
    if (!found) return { success: false, message: "Credenciales inválidas" };

    // Cargar roles modificados por admin
    const userRolesRaw = localStorage.getItem("rmerch_user_roles");
    const userRoles = userRolesRaw ? JSON.parse(userRolesRaw) : {};
    const actualRole = userRoles[found.id] || found.role || "user";

    const userObj: User = { 
      id: found.id, 
      name: found.name, 
      email: found.email,
      role: actualRole, // Usar rol modificado si existe
      isActive: found.isActive !== false // Default to true if not specified
    };
    saveSession(userObj);
    return { success: true };
  };

  const logout = () => {
    router.push('/');
    saveSession(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // validate not exists
    const extra = loadExtraUsers();
    const all = [...MOCK_USERS, ...extra];
    const exists = all.find((u: any) => u.email === email);
    if (exists) return { success: false, message: "El correo ya está registrado" };

    // Nuevos usuarios están activos como usuarios normales
    const newUser = { id: `x_${Date.now()}`, name, email, password, role: "user", isActive: true };
    const newExtra = [...extra, newUser];
    saveExtraUsers(newExtra);

    // Autologuear al usuario
    const userObj: User = { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email,
      role: "user",
      isActive: true
    };
    saveSession(userObj);
    return { success: true };
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
