/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#F5F5F5",
          text: "#1E1E1E",
          buttonBackground: "#FFFFFF",
          buttonText: "#161618",
          listsBar: "#E5E7EB",
        },
        dark: {
          background: "#000000",
          text: "#FFFFFF",
          buttonBackground: "#4CAF50",
          buttonText: "#FFFFFF",
          listsBar: "#E5E7EB",
        },
      },
    },
  },
  plugins: [],
};
