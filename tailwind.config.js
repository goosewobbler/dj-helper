/**
 * @type {import("./src/common/types").LooseObject}
 */
const theme = {
  extend: {
    transitionProperty: {
      'background-color': 'background-color',
      'max-height': 'max-height',
    },
    keyframes: {
      wiggle: {
        '0%, 6%, 12%, 18%, 24%, 30%, 36%, 42%': { transform: 'rotate(-10deg)' },
        '3%, 9%, 15%, 21%, 27%, 33%, 39%, 45%': { transform: 'rotate(10deg)' },
        '48%, 52%, 56%, 60%, 64%, 68%, 72%, 76%, 80%, 84%': {
          transform: 'rotate(-20deg)',
        },
        '50%, 54%, 58%, 62%, 66%, 70%, 74%, 78%, 82%': {
          transform: 'rotate(20deg)',
        },
        '86%, 88%, 90%, 92%': { transform: 'rotate(-40deg)' },
        '85%, 87%, 89%, 91%, 93%': { transform: 'rotate(40deg)' },
        '94%': { transform: 'rotate(-40deg) scale(0.5, 0.5)' },
        '95%': { transform: 'rotate(40deg) scale(1, 1)' },
        '96%': { transform: 'rotate(-40deg) scale(1.5, 1.5)' },
        '97%': { transform: 'rotate(40deg) scale(0.5, 0.5)' },
        '98%': { transform: 'rotate(-40deg) scale(1, 1)' },
        '99%': { transform: 'rotate(40deg) scale(1.5, 1.5)' },
        '100%': { transform: 'scale(2, 2)' },
      },
    },
    animation: {
      explode: 'wiggle 1.6s ease-in-out',
    },
    fontFamily: {
      sans: ['Jura', 'Helvetica', 'Arial', 'sans-serif'],
      title: ['Radiotechnika', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
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
const plugins = [require('tailwindcss-nested-groups')];

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
