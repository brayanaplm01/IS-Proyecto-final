"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, TruckIcon, SparklesIcon, CameraIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/40 rounded-full blur-lg animate-bounce delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <SparklesIcon className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Equipos Profesionales</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-white">Captura el</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                    momento perfecto
                  </span>
                  <span className="block text-gray-300 text-2xl sm:text-3xl lg:text-4xl font-normal mt-2">
                    con nuestras cámaras
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Descubre la mejor selección de cámaras fotográficas profesionales y accesorios. 
                Tu aventura fotográfica comienza aquí, donde la 
                <span className="text-blue-400 font-medium"> calidad</span> y la 
                <span className="text-purple-400 font-medium"> pasión</span> se encuentran.
              </p>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Clientes Felices</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-sm text-gray-400">Calificación</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/camaras"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <CameraIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Explorar Cámaras
                </Link>
                
                <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-blue-500 hover:text-white hover:bg-blue-500/10 transition-all duration-300">
                  <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Ver Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Envío gratis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Garantía 2 años</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Soporte 24/7</span>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Image */}
                <div className="relative w-full h-96 sm:h-[500px] rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm shadow-2xl">
                  <Image
                    src="/images/home/inical 1.webp"
                    alt="Cámara profesional SCAM"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={true}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <span className="text-xs font-semibold text-gray-800">PROFESIONAL</span>
                  </div>
                </div>

                {/* Floating Elements Around Image */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                  <CameraIcon className="w-6 h-6 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Additional Floating Cards */}
              <div className="absolute top-8 -left-8 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-xl hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-white text-sm font-semibold">En stock</div>
                    <div className="text-gray-400 text-xs">Envío inmediato</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 -right-8 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-xl hidden lg:block">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                  <div className="text-gray-400 text-xs">Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-2 animate-bounce">
              <span className="text-gray-400 text-xs">Desliza para ver más</span>
              <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex justify-center">
                <div className="w-1 h-2 bg-gray-400 rounded-full animate-pulse mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 w-11/12 sm:w-3/4 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-30 my-8" />

      {/* Sección 2 */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-screen-xl mx-auto px-4 md:px-10 min-h-screen bg-gray-800">
        <div className="md:w-1/2 flex flex-col justify-center mb-10 md:mb-0">
          <span className="text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Fotografía</span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 mt-2 text-center md:text-left">Explora nuestras cámaras y accesorios fotográficos</h2>
          <p className="text-gray-300 mb-6 text-base sm:text-lg text-center md:text-left">
            Ofrecemos una amplia gama de cámaras DSLR y sin espejo que se adaptan a todos los niveles de habilidad. Nuestros productos están diseñados para capturar momentos con la más alta calidad.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-60 h-36 sm:w-96 sm:h-56 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-md overflow-hidden">
            <Image
              src="/images/home/accesorios.webp"
              alt="Accesorios fotográficos profesionales"
              fill
              style={{ objectFit: 'cover' }}
              priority={true}
            />
          </div>
        </div>
      </section>

      {/* Sección 3 - Proceso de Compra */}
      <section className="flex flex-col justify-center max-w-screen-xl mx-auto px-4 md:px-10 min-h-screen bg-gray-900/80">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Proceso de compra simple y rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Selecciona tu cámara",
              desc: "Explora nuestro catálogo y elige el equipo perfecto para ti.",
              icon: CameraIcon
            },
            {
              title: "Proceso de pago seguro",
              desc: "Realiza tu compra de forma segura con múltiples opciones de pago.",
              icon: ShoppingCartIcon
            },
            {
              title: "Envío a domicilio",
              desc: "Recibe tu equipo en la puerta de tu hogar con envío rápido.",
              icon: TruckIcon
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center bg-white/5 rounded-xl p-6 shadow hover:scale-105 transition">
              <div className="flex justify-center mb-4">
                <item.icon className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="font-bold mb-2 text-lg">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}