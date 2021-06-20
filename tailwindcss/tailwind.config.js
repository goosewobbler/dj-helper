/* eslint global-require: off */
const theme = {
  extend: {},
};

const variants = {
  borderColor: ['responsive', 'hover', 'focus', 'focus-within', 'active'],
};

const plugins = [require('./tailwind.theme.config.js')];

const purge = ['./src/**/*.ts{,x}', './src/index.ejs'];

module.exports = {
  purge,
  theme,
  variants,
  plugins,
};
