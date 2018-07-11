var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin'); 
var webpack = require('webpack'); 

module.exports = {

  entry: './entry.js',                   //入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),   //dirname是根目录的意思，运行命令webpack会生成一个dist文件夹
    filename: 'foo.bundle.js'
  },
   module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
      	test:/\.scss$/,
      	loader:"style-loader!css-loader!sass-loader"
      },
      {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015','react']
      }
      }
    ]
  },

plugins: [
        			new HtmlWebpackPlugin({ template: './index.html' }),
       			 new webpack.HotModuleReplacementPlugin()
  		  ]
}