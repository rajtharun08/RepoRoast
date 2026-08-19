/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roast: {
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          orange: '#f97316',
          fire: '#ef4444',
          accent: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}
