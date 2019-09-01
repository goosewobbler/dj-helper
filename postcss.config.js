/* eslint-disable */
// const purgecss = require('@fullhuman/postcss-purgecss')({
//   content: ['./src/**/*.tsx', './src/**/*.ts', './public/index.html'],
//   css: ['./src/css/tailwind.css'],
//   // Include any special characters you're using in this regular expression
//   defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
// });

// module.exports = {
//   plugins: [
//     require('tailwindcss'),
//     require('autoprefixer'),
//     ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
//   ],
// };

// const tailwindcss = require('tailwindcss');

// module.exports = {
//   plugins: [tailwindcss('tailwind.config.js'), require('autoprefixer')()],
// };

const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    tailwindcss('./tailwind.config.js'),
    cssnano({
      preset: 'default',
    }),
    purgecss({
      content: ['./src/**/*.tsx', './src/**/*.ts', './public/index.html'],
    }),
    autoprefixer(),
  ],
};
