import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/users";
import dbConnect from "@/app/lib/dbConnection";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 });
    }

    // Retornar el usuario (sin incluir la contraseña)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error al iniciar sesión" }, { status: 500 });
  }
}