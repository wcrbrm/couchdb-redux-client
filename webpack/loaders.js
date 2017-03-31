module.exports = [
  {
    test: /\.jsx?$/,
    loaders: ['babel-loader', 'eslint-loader'],
    //plugins: ['transform-decorators-legacy'],
    exclude: /node_modules/
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  },
  {
    test: /\.css$/i,
    exclude: /node_modules/,
    loaders: [
      'style-loader',
      'css-loader?importLoaders=1',
      'postcss-loader'
    ]
  },
  {
    test: /\.(woff2?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file'
  }
];
