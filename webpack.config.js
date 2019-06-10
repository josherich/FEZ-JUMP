const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  context: path.resolve(__dirname),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'window'
  },
  mode: 'production',
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader']
      },
    ],
  }
};
