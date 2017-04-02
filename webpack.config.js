var path = require('path');
var webpack = require('webpack');

/**
  * Purpose of this webpack is to generate /dist/render.min.js
  * for website rendering
  */

module.exports = {
  devtool: 'eval',
  entry: {
    editor: './dbeditor.js'
    //vendor: require( "./webpack/vendor.js")
  },

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  plugins: [
  ],

  module: {
    loaders: require( './webpack/loaders.js')
  }
};
