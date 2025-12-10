import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-transparent">
      <div className="container mx-auto px-4 py-8 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>© {new Date().getFullYear()} R-Merch — Todos los derechos reservados</div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-[var(--color-primary)]">Sobre nosotros</Link>
            <Link href="/terms" className="hover:text-[var(--color-primary)]">Términos</Link>
            <Link href="/contact" className="hover:text-[var(--color-primary)]">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
