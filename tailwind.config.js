/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'black-bg': '#0A0A0A',
        'gold-primary': '#D4AF37',
        'gold-secondary': '#FFD700',
        'text-light': '#EAEAEA',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
