var path = require('path');
var webpack = require('webpack');

module.exports = {
  node: {
    fs: "empty"
  },
  devtool: 'eval',
  entry: {
    editor : './editor.js',
    client : './client.js',
    vendor : require( "./webpack/vendor.js")
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
     }),
     new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js'),
  ],

  module: {
    loaders: require( "./webpack/loaders.js")
  }
};
