/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#0070f3',
          secondary: '#6b7280',
        },
      },
    },
    plugins: [],
    // Optimizaciones para mejor rendimiento
    corePlugins: {
      preflight: true,
    },
    future: {
      hoverOnlyWhenSupported: true,
    },
  }