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
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Crear filtro de búsqueda
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    // Validar si no se encontraron productos en la búsqueda
    if (search && products.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No se encontraron productos con la búsqueda: "${search}"`
      }, { status: 404 });
    }

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
    const { name, price, stock, images } = body;
    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({
        success: false,
        message: "Faltan campos requeridos: name, price, stock"
      }, { status: 400 });
    }

    // Validar que price y stock sean números válidos
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json({
        success: false,
        message: "El precio debe ser un número mayor a 0"
      }, { status: 400 });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({
        success: false,
        message: "El stock debe ser un número mayor o igual a 0"
      }, { status: 400 });
    }

    // Validar imágenes si se proporcionan
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Debe proporcionar al menos una imagen del producto"
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
