import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        texturina: ["Texturina", "serif"],
        merriweather: ["Merriweather", "serif"],
      },
      colors: {
        // Primary brown palette
        brown: {
          50: "#FDF9F0",
          100: "#F7E6B5",
          200: "#EDE9E4",
          300: "#D9B26A",
          400: "#967146",
          500: "#B8873A",
          600: "#7A3A20",
          700: "#5A2C18",
          800: "#1A0E08",
          900: "#170800",
        },
        gold: {
          50: "#EDDDB4",
          100: "#F5E6A3",
          300: "#D9B26A",
          400: "#E3A419",
          500: "#B8873A",
          600: "#967146",
          700: "#C53A24",
          900: "#A3A3A3",
        },
      },
      backgroundColor: {
        primary: "#7A3A20",
        secondary: "#5A2C18",
      },
    },
  },
  plugins: [],
} satisfies Config;
