import { NextRequest, NextResponse } from "next/server";

const EXTRA_USERS_KEY = "rmerch_extra_users";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Leer los usuarios extra del localStorage simulado (en producción usar DB)
    // Como estamos en el servidor, necesitamos que el cliente envíe los datos
    const body = await req.json();
    const { users } = body;
    
    if (!users || !Array.isArray(users)) {
      return NextResponse.json(
        { error: "Se requiere el array de usuarios" },
        { status: 400 }
      );
    }
    
    // Encontrar el usuario y cambiar su estado
    const updatedUsers = users.map((user: any) => {
      if (user.id === id) {
        return { ...user, isActive: !user.isActive };
      }
      return user;
    });
    
    return NextResponse.json({ success: true, users: updatedUsers });
  } catch (error) {
    console.error("Error toggling user status:", error);
    return NextResponse.json(
      { error: "Error al cambiar el estado del usuario" },
      { status: 500 }
    );
  }
}
