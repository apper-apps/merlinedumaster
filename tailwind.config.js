/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans KR', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
        },
        secondary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          500: '#7C3AED',
          600: '#7C2D92',
          700: '#5B21B6',
        },
        accent: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
        }
      }
    },
  },
  plugins: [],
}