const flowbite = require('flowbite/plugin');
const scrollbarHide = require('tailwind-scrollbar-hide');
const daisyui = require('daisyui')

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite,
    scrollbarHide,
    daisyui,
  ],
}
