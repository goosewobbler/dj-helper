// theme.config.js
const { ThemeBuilder, Theme } = require('tailwindcss-theming');

const mainTheme = new Theme()
  .default()
  .name('default')
  .colors({
    'color-component-building': '#CB75FF',
    'color-component-installing': '#FF5A5A',
    'color-component-starting': '#FFA500',
    'color-component-launch': '#2491C8',
    'color-component-running': '#BAECFF',
    'color-component-linked': '#C9FFC9',
    'color-header': '#000000',
    'color-highlight': '#6AC4E6',
    'color-loading': '#FFA500',
    'color-negative': '#FF4545',
    'color-neutral': '#AAAAAA',
    'color-positive': '#59BB5D',
    'color-primary-background': '#EEEEEE',
    'color-primary-text': '#000000',
    'color-secondary-background': '#FFFFFF',
    'color-secondary-text': '#FFFFFF',
    'color-selected-item-border': '#000000',
    'color-tertiary-background': '#000000',
    'color-tertiary-text': '#FFFFFF',
  })
  .opacityVariant('5', 0.05, 'header')
  .opacityVariant('30', 0.3, 'primary-text')
  .opacityVariant('70', 0.7, ['primary-text', 'selected-item-border'])
  .variable('font-family-name', 'Roboto');

const darkTheme = new Theme()
  .colors({
    'color-component-installing': '#FF3360',
    'color-component-launch': '#FFFFFF',
    'color-component-running': '#11944D',
    'color-component-linked': '#11944D',
    'color-highlight': '#28FF8A',
    'color-loading': '#FFFFFF',
    'color-negative': '#FF3360',
    'color-neutral': '#FFFFFF',
    'color-positive': '#28FF8A',
    'color-primary-background': '#191919',
    'color-primary-text': '#FFFFFF',
    'color-secondary-background': '#323232',
    'color-secondary-text': '#000000',
    'color-selected-item-border': '#28FF8A',
    'color-tertiary-background': '#FFFFFF',
    'color-tertiary-text': '#000000',
  })
  .name('dark')
  .dark()
  .default()
  .assignable();

module.exports = new ThemeBuilder()
  .asPrefixedClass('theme')
  .default(mainTheme)
  .dark(darkTheme);
