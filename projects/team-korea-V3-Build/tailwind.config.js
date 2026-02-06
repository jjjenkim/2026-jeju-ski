/** @type {import('tailwindcss').Config} */
export default {
      content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
            extend: {
                  colors: {
                        // V3 Token System: "Noir Luxury" (No Emojis, No Flat Colors)

                        // 1. Backgrounds
                        "dye-black": "#050505",       // Main Background (OLED Black)
                        "void-navy": "#0B1221",       // Secondary Cards
                        "glass-panel": "rgba(255, 255, 255, 0.03)", // Subtle separation

                        // 2. Accents (Minimal usage)
                        "kor-red": "#E61B3F",         // Taegeuk Red (Primary Action)
                        "kor-blue": "#004A9F",        // Taegeuk Blue (Secondary Info)
                        "ember": "#FF4D4D",           // Critical / Hot

                        // 3. Neutrals (Metallic)
                        "chrome": "#F8FAFC",          // H1 Headings
                        "steel": "#94A3B8",           // Body Text
                        "carbon": "#334155",          // Borders
                        "silver": "#E2E8F0",          // Highlights
                  },
                  fontFamily: {
                        // Headers: Impact & Precision
                        display: ['"Teko"', 'sans-serif'],
                        // Body: Clean, modern readability
                        sans: ['"Pretendard Attribute"', '"Pretendard"', 'sans-serif'],
                  },
                  animation: {
                        'reveal-up': 'revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  },
                  keyframes: {
                        revealUp: {
                              '0%': { opacity: '0', transform: 'translateY(20px)' },
                              '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                  },
                  backgroundImage: {
                        'night-ice': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
                        'red-shift': 'linear-gradient(90deg, #E61B3F 0%, transparent 100%)',
                  }
            },
      },
      plugins: [],
}
