/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./middleware.js"
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4B06A",
        ivory: "#F8F3ED",
        blush: "#EAD8D3",
        ink: "#151515",
        rose: "#C89A95"
      },
      boxShadow: {
        luxe: "0 25px 70px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
};
