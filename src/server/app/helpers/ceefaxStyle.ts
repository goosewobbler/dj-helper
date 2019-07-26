const ceefaxStyle = `<style>
@font-face {
  font-family: 'bbcmode7';
  src: url('http://localhost:3333/bbcmode7.woff') format('woff'),
       url('http://localhost:3333/bbcmode7.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
body {
  font-family: bbcmode7 !important;
  background-color: black !important;
  filter: invert(100%);
}
.sp-c-global-header .gel-wrap {
  color: #18ca0f !important;
  filter: invert(100%);
}
.sp-c-sport-navigation__link {
  color: #18ca0f !important;
  filter: invert(100%);
}
</style>`;

export default ceefaxStyle;
