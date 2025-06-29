
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#6366F1',
        accent: '#A5B4FC',
        dark: '#0F172A',
        light: '#F1F5F9',
      },
      boxShadow: {
        card: '0 4px 14px rgba(0,0,0,0.08)',
        floating: '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
