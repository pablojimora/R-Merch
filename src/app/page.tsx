import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  // Fetch featured products from the API (limit 8)
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let products: any[] = [];
  try {
    const res = await fetch(`${base}/api/products?limit=8`, { cache: "no-store" });
    const json = await res.json().catch(() => ({ success: false, data: [] }));
    products = json && json.success ? json.data : [];
  } catch (e) {
    products = [];
  }

  return (
    <div className="py-12">
      <Hero />

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#161C40]">Productos destacados</h2>
          <a href="/shop" className="text-sm font-medium text-[#615CF2] hover:underline">Ver todo</a>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {products && products.length > 0 ? (
            products.map((p: any) => <ProductCard key={p._id} product={p} />)
          ) : (
            // fallback hardcoded cards if API empty
            <>
              <ProductCard product={{ name: "Camiseta RIWI", price: 24.99, images: [] }} />
              <ProductCard product={{ name: "Gorra Oficial", price: 18.0, images: [] }} />
              <ProductCard product={{ name: "Hoodie R-Merch", price: 49.99, images: [] }} />
              <ProductCard product={{ name: "Sticker Pack", price: 6.5, images: [] }} />
            </>
          )}
        </div>
      </section>

      <section className="mt-12 mb-24 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <h3 className="text-xl font-bold text-[#161C40]">Únete a la comunidad RIWI</h3>
          <p className="max-w-2xl text-gray-600">Suscríbete para recibir noticias, lanzamientos exclusivos y ofertas especiales de R-Merch.</p>
          <form className="mt-4 flex w-full max-w-md gap-2">
            <input aria-label="email" placeholder="Tu correo" className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20" />
            <button className="rounded-md bg-[#615CF2] px-6 py-3 text-white font-semibold hover:bg-[#4e49d9] transition">Suscribirse</button>
          </form>
        </div>
      </section>
    </div>
  );
}
