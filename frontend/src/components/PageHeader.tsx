"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
}

export default function PageHeader({ title, subtitle, badge, description }: PageHeaderProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-400/30 rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm mb-6">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <circle cx="8" cy="10" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-blue-300 text-sm font-medium">{badge}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="block text-white">{title}</span>
            {subtitle && (
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                {subtitle}
              </span>
            )}
          </h1>
          
          {description && (
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}