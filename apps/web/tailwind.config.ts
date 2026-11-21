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
          green: {
            DEFAULT: "#007834", // Oficjalny ZUS Green z portalu zus.pl
            50: "#f0f8f3",
            100: "#e2f2e6",
            200: "#c2e4cc",
            300: "#8ac99d",
            400: "#4ca869",
            500: "#007834",
            600: "#00622a",
            700: "#004e22",
            800: "#003e1c",
            900: "#003217",
          },
          navy: {
            DEFAULT: "#00416E", // Granat ZUS stosowany w nagłówkach i PUE
            50: "#f0f6fa",
            100: "#dbe8f3",
            200: "#bad5e8",
            500: "#00416E",
            600: "#003457",
            700: "#002844",
          },
          amber: {
            DEFAULT: "#f39200", // Złoty/pomarańczowy ZUS do wyróżnień
            50: "#fffbeb",
            100: "#fef3c7",
            500: "#f39200",
            600: "#d97706",
          },
          gray: {
            50: "#f8f9fa",
            100: "#f1f3f5",
            200: "#e9ecef",
            300: "#dee2e6",
            400: "#ced4da",
            500: "#adb5bd",
            600: "#6c757d",
            700: "#495057",
            800: "#343a40",
            900: "#212529",
          },
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
          '"Open Sans"',
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
