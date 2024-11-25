/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "custom-yellow": "#FFE617",
        "custom-purple": "#2a3abf",
        "custom-violet": "#7378f6",
      },
      fontFamily: {
        "custom-font": ["Calistoga-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
