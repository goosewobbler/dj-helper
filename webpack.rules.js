const babelPlugins = [
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-syntax-dynamic-import',
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }], // remove once we're class-free
];

if (process.env.NODE_ENV === 'development') {
  babelPlugins.push('react-refresh/babel'); // 'react-hot-loader/babel'
}

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    parser: {
      amd: false,
    },
  },
  {
    test: /\.(j|t)s(x)?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: false,
        presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
        plugins: babelPlugins,
      },
    },
  },
];
