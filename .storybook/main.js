const path = require('path');
const { DOTJS_OPTIONS } = require('../dev-env/constants');

module.exports = {
  framework: {
    name: '@storybook/html-webpack5',
    options: {},
  },
  stories: ['../src/**/*.stories.@(tsx|ts|jsx|js)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { docs: false },
    },
  ],
  webpackFinal: (config) => {
    config.module.rules.push(
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
            options: {
              postcssOptions: { plugins: [require('autoprefixer')] },
            },
          },
          {
            loader: 'sass-loader',
            options: { api: 'modern' },
          },
        ],
      },
    );
    config.resolve.extensions.push('.ts', '.tsx');

    // Polyfill Node built-ins so packages like sax (used by imsc) work in the browser.
    // sax does Stream.prototype → requires 'stream'; without this, stream is undefined.
    try {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve('stream-browserify'),
        events: require.resolve('events/'),
        util: require.resolve('util/'),
      };
    } catch (_) {
      // Polyfill packages not available; skip fallbacks
    }

    return config;
  },
};
