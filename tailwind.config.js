/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5500',
          orangeHover: '#E04B00',
          sand: '#D97757',
        }
      }
    },
  },
  plugins: [],
}
