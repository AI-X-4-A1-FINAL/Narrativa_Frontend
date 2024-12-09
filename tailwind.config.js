/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
      colors: {
        "custom-yellow": "#FFE617",
        "custom-purple": "#2a3abf",
        "custom-violet": "#7378f6",
        "custom-background": "#171515",
        "custom-hover": "#0e0e0e",
      },
      fontFamily: {
        sans: ["CookieRun-Regular", "sans-serif"],
      },
      scrollbar: ["rounded"],
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
