/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#05070E",
          card: "rgba(11, 17, 32, 0.82)",
          border: "rgba(0, 240, 255, 0.22)",
          cyan: "#00F0FF",
          orange: "#FF7A00",
          purple: "#7928CA",
          green: "#00DF72",
          text: "#E2E8F0",
          muted: "#64748B"
        }
      }
    },
  },
  plugins: [],
}

