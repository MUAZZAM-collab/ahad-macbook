/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          gray: {
            50: '#fbfbfd',
            100: '#f5f5f7',
            200: '#e5e5ea',
            300: '#d1d1d6',
            400: '#8e8e93',
            500: '#636366',
            600: '#48484a',
            700: '#3a3a3c',
            800: '#2c2c2e',
            900: '#1c1c1e',
            950: '#000000',
          },
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          spaceblack: '#141415',
          spacegray: '#202124',
          silver: '#e3e4e6',
          starlight: '#f0e5d8',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'apple-md': '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'apple-glow': '0 0 40px rgba(0, 113, 227, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
