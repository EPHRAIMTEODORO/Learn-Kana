import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        academic: {
          background: "var(--background)",
          surface: "var(--surface)",
          section: "var(--section)",
          primary: "var(--primary)",
          primaryDark: "var(--primary-dark)",
          text: "var(--foreground)",
          muted: "var(--muted)",
          border: "var(--border)",
          success: "var(--success)",
          warning: "var(--warning)",
          error: "var(--error)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
