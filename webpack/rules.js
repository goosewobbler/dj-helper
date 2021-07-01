const isDev = process.env.NODE_ENV === 'development';
const envName = isDev ? 'development' : 'production';

const plugins = ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-syntax-dynamic-import'];

module.exports = (context) => {
  if (isDev && context === 'renderer') {
    plugins.push('react-refresh/babel');
  }

  return [
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
            envName,
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
            plugins,
          },
        },
      ],
    },
  ];
};
