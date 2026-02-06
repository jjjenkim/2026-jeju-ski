/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF4646",
        secondary: "#148CFF",
        muted: "#3c3c3c",
        "deep-bg": "#121212",
        "off-white": "#f5f5f5"
      },
      fontFamily: {
        sans: ["Pretendard", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem'
      }
    }
  },
  plugins: [],
}
