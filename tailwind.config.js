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
        "custom-background": "#171515",
        "custom-hover": "#0e0e0e"
      },
      fontFamily: {
        "custom-font": ["Calistoga-Regular", "sans-serif"],
      },
      scrollbar: ["rounded"],
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
