"use client";

import Link from "next/link";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CameraIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Productos",
      icon: CameraIcon,
      links: [
        { href: "/camaras", label: "Cámaras DSLR" },
        { href: "/camaras", label: "Cámaras Sin Espejo" },
        { href: "/accesorios", label: "Lentes" },
        { href: "/accesorios", label: "Trípodes" },
        { href: "/accesorios", label: "Accesorios" }
      ]
    },
    {
      title: "Empresa",
      icon: UserGroupIcon,
      links: [
        { href: "#", label: "Sobre Nosotros" },
        { href: "#", label: "Nuestra Historia" },
        { href: "#", label: "Equipo" },
        { href: "#", label: "Carreras" },
        { href: "#", label: "Blog" }
      ]
    },
    {
      title: "Soporte",
      icon: InformationCircleIcon,
      links: [
        { href: "#", label: "Centro de Ayuda" },
        { href: "#", label: "Garantía" },
        { href: "#", label: "Reparaciones" },
        { href: "#", label: "Manuales" },
        { href: "#", label: "FAQ" }
      ]
    },
    {
      title: "Cuenta",
      icon: ShoppingCartIcon,
      links: [
        { href: "/carrito", label: "Mi Carrito" },
        { href: "#", label: "Mi Cuenta" },
        { href: "#", label: "Historial" },
        { href: "#", label: "Lista de Deseos" },
        { href: "#", label: "Seguimiento" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: "📘" },
    { name: "Instagram", href: "#", icon: "📸" },
    { name: "Twitter", href: "#", icon: "🐦" },
    { name: "YouTube", href: "#", icon: "📺" },
    { name: "LinkedIn", href: "#", icon: "💼" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-400 group-hover:to-blue-500 transition-all duration-300">
                SCAM
              </div>
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-md">
              Tu destino para cámaras y accesorios fotográficos de alta calidad. 
              Captura momentos únicos con equipos profesionales.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <EnvelopeIcon className="w-4 h-4 text-blue-400" />
                <span>contacto@scam.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <PhoneIcon className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <MapPinIcon className="w-4 h-4 text-blue-400" />
                <span>123 Photography St, Ciudad</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="">
                <div className="flex items-center space-x-2 mb-4">
                  <IconComponent className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold text-sm">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 text-sm hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center lg:mx-0 lg:text-left">
            <h3 className="text-white font-semibold mb-2">Suscríbete a nuestro newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Recibe ofertas exclusivas y las últimas novedades en fotografía</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="tu-email@ejemplo.com"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700/50 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-xs text-center md:text-left">
              <span>© {currentYear} SCAM. Todos los derechos reservados.</span>
              <span className="mx-2">|</span>
              <Link href="#" className="hover:text-blue-400 transition-colors duration-200">Política de Privacidad</Link>
              <span className="mx-2">|</span>
              <Link href="#" className="hover:text-blue-400 transition-colors duration-200">Términos de Servicio</Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-xs">Síguenos:</span>
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-110"
                    title={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}