/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // El ** busca dentro de features, auth y cualquier otra subcarpeta
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}