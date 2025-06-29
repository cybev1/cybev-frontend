module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        pulse: "pulse 4s infinite",
        ping: "ping 6s infinite",
      }
    },
  },
  plugins: [],
}