import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zus: {
          blue: {
            DEFAULT: "#005A9C",
            50: "#eaf3fa",
            100: "#d0e4f5",
            200: "#a3cbee",
            300: "#6aaae5",
            400: "#3285db",
            500: "#005A9C",
            600: "#004b85",
            700: "#003d6d",
            800: "#003056",
            900: "#002441",
          },
          green: {
            DEFAULT: "#00823C",
            50: "#edfcf2",
            100: "#d5f7e1",
            200: "#abefc3",
            500: "#00823C",
            600: "#006c32",
            700: "#005727",
          },
          amber: {
            DEFAULT: "#D97706",
            50: "#fffbeb",
            100: "#fef3c7",
            500: "#d97706",
            600: "#b45309",
          },
          navy: "#0C2340",
          light: "#F4F7FA",
        },
        gov: {
          blue: "#005A9C",
          red: "#DC143C",
          darkRed: "#A30E2B",
          dark: "#1A1A1A",
          gray: "#555555",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
