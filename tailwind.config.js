/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html", "./static/**/*.js"],
  theme: {
    extend: {
      colors: {
        'ocean-blue': '#003366',
        'safety-orange': '#FF6600',
        'safety-yellow': '#FFCC00',
      },
    },
  },
  plugins: [],
}
