/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#06060F",
        layer1: "#0C0C18",
        layer2: "#12121F",
        red: "#B11226",
        redDark: "#8A0D1E",
        coral: "#E8714A",
        coralLight: "#FF9B7A",
        textSoft: "#A09A8E",
      },
    },
  },
  plugins: [],
}