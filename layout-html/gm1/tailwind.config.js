/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode based on the 'dark' class
  content: [
    './*.html', // All HTML files in the root directory
    './**/*.{html,js}', // All HTML and JS files in subdirectories
  ],
  theme: {
    extend: {
      colors: {
        'primary-accent': '#fc820f',
        'secondary-accent': '#fcfc0f',
      },
    },
  },
  plugins: [],
};