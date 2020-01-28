/* eslint global-require: off */
module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within', 'active'],
  },
  plugins: [require('./tailwind.theme.config')],
};
