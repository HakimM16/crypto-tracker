/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#00abf0',
        customGray: '#26374c',
      },
    },
  },
  plugins: [],
}