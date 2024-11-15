/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow': '#FFE617',
        'custom-purple': '#2a3abf'
      },
      fontFamily: {
        'custom-font': ['Calistoga-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

