/* eslint global-require: off */
// const tailwind = require('tailwindcss/defaultTheme');
module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('./tailwind.theme.config'),
    require('tailwindcss-alpha')({
      alpha: {
        '5': 0.05,
        '30': 0.3,
        '70': 0.7,
      },
    }),
  ],
};
