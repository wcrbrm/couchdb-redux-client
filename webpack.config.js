var path = require('path');
var webpack = require('webpack');

/**
  * Purpose of this webpack is to generate /dist/render.min.js
  * for website rendering
  */

module.exports = {
  devtool: 'eval',
  entry: {
    0: 'webpack-dev-server/client?http://localhost:8000',  // WebpackDevServer host and port
    1: 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    editor: './editor.js'
    //vendor: require( "./webpack/vendor.js")
  },

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BASE_URL': '"http://localhost:7117/celebrity-networth.com/"',
      'process.env.API_URL': '"/db/"'
    }),
    new webpack.HotModuleReplacementPlugin()
    //new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
  ],

  module: {
    loaders: require( './webpack/loaders.js')
  },

  devServer: {
    port: 8000,
    hot: true,
    proxy: {
      '/**':  {
        contentBase: './',
        target: 'http://localhost:7117/',
        secure: false,
        pathRewrite: {
          '^/': '/celebrity-networth.com/'
        }
      }
    }

  }
};
