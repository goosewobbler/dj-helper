module.exports = [
  {
    enforce: 'pre',
    test: /\.js$/,
    loader: 'source-map-loader',
  },
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
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
];
