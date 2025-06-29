module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#5F3EED',
        secondary: '#A689FC',
        accent: '#D2BFFF',
        muted: '#F5F3FF',
      },
      boxShadow: {
        glow: '0 0 8px rgba(95, 62, 237, 0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}