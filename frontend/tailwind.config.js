/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'navbar-link-active-bg' : '#122c1c',
      'navbar-main-color' : '#121c26',
      'navbar-active-link-text' : "#00ffa6",
      'navbar-link' : "#b4b4b4c5",
      'grey-text' : '#808080',
      'post-content-color' : '#ffffffb7',
      'login-bg' : "#ffffff1e",
      'border-color': '#2b3540',

      'primary-color' : "hsl(215, 50%, 90%)",
      "secondary-color": "#060E0E",
      'tertiary-color' : '#121c26',
      'accent-color' : "#00FFA7",
    } ,

    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        slide: {
          '0%' : {left: '-30%'},
          '50%': {left: '50%'},
          '100%': {left: '100%'},
        }
      },
      animation: {
        slide: 'slide 3.0s linear infinite',
      }
    },
  },
  plugins: [],
}