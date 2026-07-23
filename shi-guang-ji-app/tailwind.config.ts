import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E8728A",
          hover: "#D65E78",
          light: "#F5A3B5",
          50: "#FEF1F3",
          100: "#FCE4E9",
          200: "#F9C6D0",
          300: "#F2A0AE",
          400: "#E8728A",
          500: "#D14E68",
          600: "#B83D56",
          700: "#993148",
          800: "#7E2940",
          900: "#6B2238",
        },
        gold: {
          DEFAULT: "#F5C542",
          light: "#FDDF8E",
          50: "#FFFBEB",
          100: "#FEF3C7",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans SC",
          "PingFang SC",
          "Microsoft YaHei",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      spacing: {
        sidebar: "260px",
        header: "64px",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
