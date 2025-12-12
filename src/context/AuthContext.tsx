"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import MOCK_USERS from "@/lib/mockUsers";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "rmerch_user";
const EXTRA_USERS_KEY = "rmerch_extra_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
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
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Credenciales inválidas" };
      }

      const userObj: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };
      saveSession(userObj);
      return { success: true };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return { success: false, message: "Error al conectar con el servidor" };
    }
  };

  const logout = () => {
    saveSession(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // validate not exists
    const extra = loadExtraUsers();
    const all = [...MOCK_USERS, ...extra];
    const exists = all.find((u: any) => u.email === email);
    if (exists) return { success: false, message: "El correo ya está registrado" };

    const newUser = { id: `x_${Date.now()}`, name, email, password, role: "user" };
    const newExtra = [...extra, newUser];
    saveExtraUsers(newExtra);

    const userObj: User = { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email,
      role: "user"
    };
    saveSession(userObj);
    return { success: true };
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
