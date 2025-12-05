import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/app/lib/dbConnection";
import Product from "@/app/models/products";

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error al obtener productos",
      error: error.message
    }, { status: 500 });
  }
}

// POST - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    await dbConnection();

    const body = await request.json();

    // Validar campos requeridos
    const { name, price, stock } = body;
    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({
        success: false,
        message: "Faltan campos requeridos: name, price, stock"
      }, { status: 400 });
    }

    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json({
      success: true,
      message: "Producto creado exitosamente",
      data: newProduct
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error al crear producto",
      error: error.message
    }, { status: 500 });
  }
}
