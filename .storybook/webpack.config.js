const path = require('path');
const { DOTJS_OPTIONS } = require('../dev-env/constants');

module.exports = ({ config }) => {
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: ['ts-loader'],
    },
    {
      test: /\.dot$/,
      exclude: /node_modules/,
      loader: 'dotjs-loader',
      options: DOTJS_OPTIONS,
    },
    {
      test: /^(?:(?!inline\.svg).)*\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|wav|mp3)(\?.*)?$/,
      loader: 'url-loader',
      options: { name: '[path][name].[ext]?[hash]', limit: 10000 },
    },
    {
      test: /\.inline\.svg$/,
      loader: 'svg-inline-loader',
    },
    {
      test: /\.s?css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[path][name]__[local]__[hash:base64:5]',
            },
            sourceMap: true,
            importLoaders: 2,
          },
        },
        {
          loader: 'postcss-loader',
          options: { postcssOptions: { plugins: [require('autoprefixer')] } },
        },
        'sass-loader',
      ],
    },
  ];

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
