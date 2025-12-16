import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

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

      <NewsletterSubscribe />
    </div>
  );
}
