// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial for Tailwind to scan your components
  ],
  theme: {
    extend: {
      colors: {
        'primary-accent': '#E98D2E', // The main orange
        'secondary-accent': '#FFD700', // The golden yellow
      }
    },
  },
  plugins: [],
}