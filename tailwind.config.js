/* eslint global-require: off */
module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('tailwindcss-alpha')({
      alpha: {
        '5': 0.05,
        '30': 0.3,
        '70': 0.7,
      },
    }),
  ],
};
