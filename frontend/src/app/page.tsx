"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, TruckIcon, SparklesIcon, CameraIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Elements - Optimized */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/30 rounded-full blur-lg"></div>
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="transition-transform duration-500 group-hover:scale-105"
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

      {/* Products Showcase Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Effects - Optimized */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-500/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <CameraIcon className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Equipos Profesionales</span>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="block text-white">Explora nuestras</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                    cámaras y accesorios
                  </span>
                  <span className="block text-gray-300">fotográficos</span>
                </h2>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-300 leading-relaxed">
                Ofrecemos una amplia gama de cámaras DSLR y sin espejo que se adaptan a todos los niveles de habilidad. 
                Nuestros productos están diseñados para capturar momentos con la 
                <span className="text-blue-400 font-medium"> más alta calidad</span> y 
                <span className="text-purple-400 font-medium"> precisión profesional</span>.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">Cámaras DSLR</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-4">Tecnología avanzada</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">Sin Espejo</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-4">Portabilidad máxima</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">Accesorios</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-4">Complementos perfectos</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">Lentes Premium</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-4">Calidad excepcional</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/camaras"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <CameraIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Ver Cámaras
                </Link>
                
                <Link
                  href="/accesorios"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-blue-500 hover:text-white hover:bg-blue-500/10 transition-all duration-300"
                >
                  <span className="mr-2">🔧</span>
                  Accesorios
                </Link>
              </div>
            </div>

            {/* Right Content - Enhanced Image */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl backdrop-blur-sm border border-gray-700/50 overflow-hidden shadow-2xl">
                <Image
                  src="/images/home/accesorios.webp"
                  alt="Accesorios fotográficos profesionales"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-700 hover:scale-110"
                  priority={true}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                
                {/* Floating Elements */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">Equipos Profesionales</p>
                        <p className="text-gray-300 text-sm">Calidad garantizada</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-bold text-lg">500+</p>
                        <p className="text-gray-400 text-xs">Productos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 w-11/12 sm:w-3/4 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-30 my-8" />

      {/* Shopping Process Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 overflow-hidden">
        {/* Background Effects - Optimized */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-20 w-28 h-28 bg-green-500/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-24 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-purple-500/25 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm mb-6">
              <ShoppingCartIcon className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Compra Fácil</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="block text-white">Proceso de compra</span>
              <span className="block bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                simple y rápido
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              En solo 3 pasos sencillos, tendrás tu equipo fotográfico ideal en tus manos
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Selecciona tu cámara",
                desc: "Explora nuestro catálogo completo y elige el equipo perfecto que se adapte a tu estilo fotográfico.",
                icon: CameraIcon,
                color: "blue",
                features: ["Filtros avanzados", "Comparación", "Reviews"]
              },
              {
                step: "02", 
                title: "Proceso de pago seguro",
                desc: "Realiza tu compra de forma completamente segura con múltiples opciones de pago y cifrado SSL.",
                icon: ShoppingCartIcon,
                color: "green",
                features: ["Pago seguro", "Múltiples métodos", "Cifrado SSL"]
              },
              {
                step: "03",
                title: "Envío a domicilio",
                desc: "Recibe tu equipo en la puerta de tu hogar con envío rápido y seguimiento en tiempo real.",
                icon: TruckIcon,
                color: "purple",
                features: ["Envío gratis", "Seguimiento", "Entrega rápida"]
              },
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                {/* Connection Line (hidden on mobile) */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                )}

                {/* Card */}
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-800/70">
                  {/* Step Number */}
                  <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-r ${
                    item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    item.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6 mt-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                      item.color === 'blue' ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' :
                      item.color === 'green' ? 'from-green-500/20 to-green-600/20 border-green-500/30' :
                      'from-purple-500/20 to-purple-600/20 border-purple-500/30'
                    } border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-8 h-8 ${
                        item.color === 'blue' ? 'text-blue-400' :
                        item.color === 'green' ? 'text-green-400' :
                        'text-purple-400'
                      } group-hover:rotate-12 transition-transform duration-300`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                      {item.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            item.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            item.color === 'green' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Link
                href="/camaras"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <ShoppingCartIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Empezar a Comprar
              </Link>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-green-500 hover:text-white hover:bg-green-500/10 transition-all duration-300">
                <span className="mr-2">📞</span>
                ¿Necesitas ayuda?
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              ¿Tienes dudas? Nuestro equipo está listo para ayudarte 24/7
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}