const plugins = ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-syntax-dynamic-import'];

if (process.env.NODE_ENV === 'development') {
  plugins.push('react-hot-loader/babel');
}

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
  plugins,
};
