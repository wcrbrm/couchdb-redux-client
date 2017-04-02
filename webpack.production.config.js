var path = require('path');
var webpack = require('webpack');

module.exports = {
  node: {
    fs: "empty"
  },
  entry: {
    editor : './dbeditor.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].min.js",
    publicPath: '/dist/'
  },
  plugins: [
     new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
     new webpack.optimize.DedupePlugin(),
     new webpack.optimize.UglifyJsPlugin({
	      minimize: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false, screw_ie8: true
        }
     })
  ],
  module: {
    loaders: require( "./webpack/loaders.js")
  }
};
