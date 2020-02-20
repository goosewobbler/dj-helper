/* eslint global-require: off */
module.exports = {
  theme: {
    extend: {},
    animations: {
      spin: {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(360deg)',
        },
      },
    },
    animationDuration: {
      'default': '1s',
      '0s': '0s',
      '500ms': '0.5s',
      '1s': '1s',
      '2s': '2s',
      '3s': '3s',
      '4s': '4s',
      '5s': '5s',
    },
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within', 'active'],
  },
  plugins: [require('./tailwind.theme.config'), require('tailwindcss-animations')],
};
