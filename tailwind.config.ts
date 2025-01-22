const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class', // Use class-based dark mode
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
      },
    },
  },
  plugins: [],
}
