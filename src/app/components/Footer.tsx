import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-gray-200 pt-16 pb-8 px-6 sm:px-10 sticky top-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo / Marca */}
        <div>
          <h2 className="text-2xl font-bold text-emerald-400">NovaForge</h2>
          <p className="mt-4 text-sm text-white">
            Desarrollo web moderno y eficiente para empresas que quieren destacar.
          </p>
        </div>

        {/* Enlaces */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Servicios</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#servicios" className="hover:text-emerald-400">Landing page</Link></li>
            <li><Link href="#servicios" className="hover:text-emerald-400">Página corporativa</Link></li>
            <li><Link href="#servicios" className="hover:text-emerald-400">Sistema con login</Link></li>
          </ul>
        </div>

        {/* Politicas */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Info Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/politica" className="hover:text-emerald-400">Política</Link></li>
            <li><Link href="/privacidad" className="hover:text-emerald-400">Privacidad</Link></li>
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Nosotros</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#nosotros" className="hover:text-emerald-400">¿Quiénes somos?</Link></li>
            <li><Link href="#contacto" className="hover:text-emerald-400">Contáctanos</Link></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Síguenos</h3>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-emerald-400" aria-label="Instagram">
              <Instagram className="size-5" />
            </Link>
            <Link href="#" className="hover:text-emerald-400" aria-label="Facebook">
              <Facebook className="size-5" />
            </Link>
            <Link href="#" className="hover:text-emerald-400" aria-label="LinkedIn">
              <Linkedin className="size-5" />
            </Link>
            <Link href="mailto:contacto@acode.dev" className="hover:text-emerald-400" aria-label="Email">
              <Mail className="size-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-12 border-t border-white pt-6 text-sm text-center text-white">
        © {new Date().getFullYear()} NovaForge. Todos los derechos reservados.
      </div>
    </footer>
  )
}
