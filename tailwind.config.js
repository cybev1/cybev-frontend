module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        bounceSlow: 'bounce 2s infinite',
      },
      colors: {
        primary: '#6C63FF',
      },
    },
  },
  plugins: [],
};
