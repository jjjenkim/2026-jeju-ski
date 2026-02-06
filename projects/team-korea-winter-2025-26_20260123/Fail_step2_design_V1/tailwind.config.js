/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#ff4747",
        "secondary": "#148CFF",
        "secondary-blue": "#148CFF",
        "background-light": "#f8f5f5",
        "background-dark": "#0a0a0a",
        "deep-bg": "#121212",
        "off-white": "#f5f5f5",
        "muted-gray": "#3c3c3c",
        "forest-grey": "#2a2a2a",
        "korea-red": "#ff4747", // legacy support
        "korea-blue": "#148CFF", // legacy support
      },
      fontFamily: {
        "display": ["Lexend", "Noto Sans KR", "Inter", "sans-serif"],
        "sans": ["Inter", "Lexend", "sans-serif"]
      },
      borderRadius: {
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
      },
      animation: {
        'draw': 'drawLine 1.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        drawLine: {
          'from': { strokeDashoffset: '400' },
          'to': { strokeDashoffset: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
