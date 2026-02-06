/** @type {import('tailwindcss').Config} */
export default {
      content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
            extend: {
                  fontFamily: {
                        sans: ['Pretendard Variable', 'Inter', 'sans-serif'],
                        display: ['Outfit', 'sans-serif'],
                  },
                  colors: {
                        'tangaroa': '#0D2744',
                        'wedgewood': '#53728A',
                        'ship-cove': '#7691AD',
                        'spindle': '#B9CFDD',
                        'firebrick': '#FF929A',
                        'korea-red': {
                              DEFAULT: '#FF929A', // Mapping to Firebrick
                              dark: '#E07B83',
                              light: '#FFAAB1',
                        },
                        'korea-blue': {
                        },
                        'silver': {
                              DEFAULT: '#96A3B4', // Using Cadet Grey for Silver
                              dark: '#7A8796',
                        },
                        'bronze': {
                              DEFAULT: '#607990',
                              dark: '#4C6073',
                        },
                        gray: {
                              950: '#181A1E', // Matching Eerie Black
                        }
                  },
                  fontFamily: {
                        sans: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
                        body: ['Pretendard', '-apple-system', 'sans-serif'],
                        display: ['Pretendard Variable', 'sans-serif'],
                        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
                  },
                  backgroundImage: {
                        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #003478 0deg, #0a0a0b 180deg, #C60C30 360deg)',
                        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  },
            },
      },
      plugins: [],
}
