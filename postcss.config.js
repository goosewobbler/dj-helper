const tailwindcss = require('tailwindcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const plugins = [tailwindcss({ config: './tailwindcss/tailwind.config.js' }), autoprefixer()];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    cssnano({
      preset: 'default',
    }),
  );
}

module.exports = {
  plugins,
};
