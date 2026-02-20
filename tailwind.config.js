/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marcona: {
          500: '#0471e6ff', // Este es el azul que estamos llamando
        }
      }
    },
  },
  plugins: [],
}