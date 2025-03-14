/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sierra-blue': '#0F4C81',
        'sierra-green': '#2E8B57',
        'sierra-light': '#F5F5F5',
        'sierra-dark': '#333333',
      },
    },
  },
  plugins: [],
} 