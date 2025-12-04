"use client";

import Link from "next/link";
import { useAuth } from "@/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Header() {
  const { user, logout, onLoginClick } = useAuth();
  const cartCount = useCartStore((state) => state.products.reduce((acc, p) => acc + p.cantidad, 0));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/camaras", label: "Cámaras" },
    { href: "/accesorios", label: "Accesorios" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-400 group-hover:to-blue-500 transition-all duration-300">
                SCAM
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-200 group"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-gray-800/50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                </Link>
              ))}
            </nav>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.rol === "administrador" && (
                    <Link
                      href="/admin"
                      className="px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30 rounded-full hover:bg-purple-500/20 transition-all duration-200"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 text-gray-300">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.nombre}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="px-6 py-2 text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Iniciar Sesión
                </button>
              )}

              {/* Cart */}
              <Link href="/carrito" className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 group">
                <ShoppingCartIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              
              <hr className="border-gray-800" />
              
              {user ? (
                <div className="space-y-3">
                  {user.rol === "administrador" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 rounded-lg transition-all duration-200"
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <div className="px-4 py-2 text-gray-400">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Hola, {user.nombre}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-900 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 rounded-lg transition-all duration-200 font-semibold"
                >
                  Iniciar Sesión
                </button>
              )}
              
              <Link
                href="/carrito"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Carrito</span>
                </div>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}