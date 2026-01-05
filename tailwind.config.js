/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gwen-primary': '#ec4899',
        'gwen-light': '#fce7f3',
        'ludo-primary': '#3b82f6',
        'ludo-light': '#dbeafe',
      },
    },
  },
  plugins: [],
}
