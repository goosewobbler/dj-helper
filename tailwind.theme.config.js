// theme.config.js
const { ThemeBuilder, Theme } = require('tailwindcss-theming');

const mainTheme = new Theme()
  .default()
  .name('default')
  .colors({
    'component-building': '#CB75FF',
    'component-installing': '#FF5A5A',
    'component-starting': '#FFA500',
    'component-launch': '#2491C8',
    'component-running': '#BAECFF',
    'component-linked': '#C9FFC9',
    'header': '#000000',
    'highlight': '#6AC4E6',
    'loading': '#FFA500',
    'negative': '#FF4545',
    'neutral': '#AAAAAA',
    'positive': '#59BB5D',
    'dialog-overlay': '#000000',
    'primary-background': '#EEEEEE',
    'primary-text': '#000000',
    'secondary-background': '#FFFFFF',
    'secondary-text': '#FFFFFF',
    'selected-item-border': '#000000',
    'tertiary-background': '#000000',
    'tertiary-text': '#FFFFFF',
  })
  .opacityVariant('5', 0.05, 'header')
  .opacityVariant('30', 0.3, 'primary-text')
  .opacityVariant('50', 0.5, 'dialog-overlay')
  .opacityVariant('70', 0.7, ['primary-text', 'selected-item-border'])
  .variable('font-family-name', 'Roboto');

const darkTheme = new Theme()
  .colors({
    'component-installing': '#FF3360',
    'component-launch': '#FFFFFF',
    'component-running': '#11944D',
    'component-linked': '#11944D',
    'highlight': '#28FF8A',
    'loading': '#FFFFFF',
    'negative': '#FF3360',
    'neutral': '#FFFFFF',
    'positive': '#28FF8A',
    'primary-background': '#191919',
    'primary-text': '#FFFFFF',
    'secondary-background': '#323232',
    'secondary-text': '#000000',
    'selected-item-border': '#28FF8A',
    'tertiary-background': '#FFFFFF',
    'tertiary-text': '#000000',
  })
  .name('dark')
  .dark()
  .default()
  .assignable();

module.exports = new ThemeBuilder()
  .asPrefixedClass('theme')
  .default(mainTheme)
  .dark(darkTheme);
