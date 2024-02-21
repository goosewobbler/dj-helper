const isDev = process.env.NODE_ENV === 'development';
const envName = isDev ? 'development' : 'production';

const plugins = ['@babel/plugin-syntax-dynamic-import'];

export default (context) => {
  if (isDev && context === 'renderer') {
    plugins.push('react-refresh/babel');
  }

  return [
    {
      enforce: 'pre',
      exclude: /node_modules/,
      test: /\.js$/,
      loader: 'source-map-loader',
    },
    // Add support for native node modules
    {
      test: /\.node$/,
      use: 'node-loader',
    },
    {
      test: /\.(j|t)s(x)?$/,
      exclude: /node_modules/,
      parser: {
        amd: false,
      },
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
