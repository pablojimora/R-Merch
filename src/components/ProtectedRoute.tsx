"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
};

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo = "/login"
}: ProtectedRouteProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is not logged in
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Check if admin is required but user is not admin
    if (requireAdmin && !isAdmin()) {
      router.push("/"); // Redirect to home if not admin
      return;
    }
  }, [user, requireAdmin, router, redirectTo, isAdmin]);

  // Show loading or nothing while checking
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#615CF2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if admin required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Acceso denegado</h2>
          <p className="mt-2 text-gray-600">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
