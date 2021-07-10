/**
 * @type {import("./src/common/types").LooseObject}
 */
const theme = {
  extend: {},
};

/**
 * @type {import("./src/common/types").LooseObject}
 */
const variants = {
  borderColor: ['responsive', 'hover', 'focus', 'focus-within', 'active'],
};

/**
 * @type {unknown[]}
 */
const plugins = [];

/**
 * @type {string[]}
 */
const purge = ['./src/**/*.ts{,x}', './src/index.ejs'];

module.exports = {
  purge,
  theme,
  variants,
  plugins,
};
