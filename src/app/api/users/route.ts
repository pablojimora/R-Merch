import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/users";
import dbConnect from "@/app/lib/dbConnection";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "El usuario ya existe." }, { status: 400 });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // Rol predeterminado
    });

    await newUser.save();

    return NextResponse.json({ success: true, message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error al registrar el usuario." }, { status: 500 });
  }
}