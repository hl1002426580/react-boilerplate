const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./base.config')

const config = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].style.css', 
      chunkFilename: '[id].css'
    }), 
    new webpack.DefinePlugin({
      __DEVTOOLS__: true,
      __DEVLOGGER__: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      { 
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                // publicPath is the relative path of the resource to the context
                // e.g. for ./css/admin/main.css the publicPath will be ../../
                // while for ./css/main.css the publicPath will be ../
                return path.relative(path.dirname(resourcePath), context) + '/'
              },
              // reloadAll: true,
              hmr: true
            }
          },
          'css-loader'
        ]
      },
    ],
  },
  devServer:{
    contentBase: [path.join(__dirname, '../src'),path.join(__dirname, '../dist')],
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    // inline: true,
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    proxy: {
      '/api': {
        'target': 'http://yapi.demo.qunar.com/mock/70113/api',
        'changeOrigin': true,
        logLevel: 'debug',
        'pathRewrite': {
          '^/api': ''
        }
      }
    }
  }
}


module.exports = merge(baseConfig,config)