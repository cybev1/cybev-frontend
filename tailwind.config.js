
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'cybev-primary': '#8b5cf6',
        'cybev-accent': '#ec4899',
      },
      animation: {
        fade: 'fadeIn 2s ease-in forwards',
        bounceIn: 'bounceIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        bounceIn: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.3)'
          },
          '50%': {
            opacity: 1,
            transform: 'scale(1.05)'
          },
          '70%': {
            transform: 'scale(0.9)'
          },
          '100%': {
            transform: 'scale(1)'
          }
        }
      }
    },
  },
  plugins: [],
}
