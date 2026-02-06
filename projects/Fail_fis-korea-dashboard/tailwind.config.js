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
        ksa: {
          primary: '#003DA5',
          secondary: '#C8102E',
          dark: '#1E2139',
          'dark-secondary': '#2A2F4F',
          'dark-card': '#252836',
          'dark-border': '#374151',
          'card-glass': 'rgba(42, 47, 79, 0.6)',
        },
        neon: {
          mint: '#34D399',
          gold: '#FBBF24',
          purple: '#A78BFA',
          pink: '#F472B6',
          cyan: '#22D3EE',
        },
        accent: {
          gold: '#FBBF24',
          cyan: '#22D3EE',
          purple: '#A78BFA',
        },
        glow: {
          cyan: 'rgba(34, 211, 238, 0.3)',
          gold: 'rgba(251, 191, 36, 0.3)',
          purple: 'rgba(167, 139, 250, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.5)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
