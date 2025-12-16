import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#615CF2] via-[#4e49d9] to-[#62D9AD] p-8 md:p-12 lg:p-16">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2BD968]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Content */}
        <div className="max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2BD968] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2BD968]"></span>
            </span>
            <span className="text-sm font-medium text-white">Tienda Oficial RIWI</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Viste el estilo
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              de RIWI
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Descubre nuestra colección exclusiva de merch, ropa y accesorios diseñados para la comunidad RIWI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              href="/shop" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#615CF2] rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Explorar Tienda
              <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/emprendimientos" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/20 hover:bg-white/20 transition-all"
            >
              Ver Emprendimientos
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-white">150+</div>
              <div className="text-sm text-white/70">Productos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1,200+</div>
              <div className="text-sm text-white/70">Clientes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-white/70">Satisfacción</div>
            </div>
          </div>
        </div>

        {/* Logo/Image */}
        <div className="hidden lg:flex items-center justify-center flex-shrink-0">
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl rotate-6 animate-pulse"></div>
            <div className="relative h-full w-full bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center p-12 border border-white/30">
              <Image 
                src="/RiwiLogo.png" 
                alt="RIWI Logo" 
                width={200}
                height={200}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
