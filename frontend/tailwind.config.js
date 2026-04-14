/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        accent: "#10B981",
        background: "#0B0F19",
        surface: "#1A2235",
        textPrimary: "#F9FAFB",
        textSecondary: "#9CA3AF",
      },
    },
  },
  plugins: [],
}
