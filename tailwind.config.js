/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['"Instrument Serif"', 'serif'],
      },
      colors: {
        'claret': {
          '50': '#fef2f3',
          '100': '#fce7e8',
          '200': '#f9d2d6',
          '300': '#f4adb4',
          '400': '#ed7f8d',
          '500': '#e25167',
          '600': '#ce3050',
          '700': '#ad2342',
          '800': '#91203d',
          '900': '#82203c',
          '950': '#450c1b',
        },

      }
    },
  },
  plugins: [],
}

