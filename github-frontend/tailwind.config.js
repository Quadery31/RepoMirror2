/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- This line is the key change!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      forest: '#0b1f16',
      forestCard: '#102b1f',
      mintBg: '#ecfdf5',
      emeraldGlow: '#34d399',
    },
  },
},

  plugins: [],
}