import Link from "next/link";

export default function Hero() {
  return (
    <section className="mt-12 flex w-full items-center justify-between gap-8 rounded-lg bg-gradient-to-r from-[#615CF2] to-[#62D9AD] p-8 text-white">
      <div className="max-w-xl">
        <h1 className="text-4xl font-extrabold leading-tight">R-Merch — La tienda oficial de RIWI</h1>
        <p className="mt-4 text-lg opacity-95">Merch, ropa y accesorios oficiales. Calidad pensada para la comunidad RIWI.</p>

        <div className="mt-6 flex gap-3">
          <Link href="/shop" className="inline-flex items-center gap-3 rounded-full bg-[#161C40] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95">
            Ir a la tienda
          </Link>
          <Link href="/about" className="inline-flex items-center gap-3 rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white/95 hover:bg-white/10">
            Conócenos
          </Link>
        </div>
      </div>

      <div className="hidden w-1/3 flex-shrink-0 items-center justify-center sm:flex">
        <div className="h-48 w-48 rounded-md bg-white/10 p-6">
          <div className="h-full w-full rounded-md bg-white/20" />
        </div>
      </div>
    </section>
  );
}
