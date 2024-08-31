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

    extend: {},
  },
  plugins: [],
}