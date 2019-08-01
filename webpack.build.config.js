const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: '../../../../templates/frontend_v1/index.html',
      template: './frontend_v1/templates/frontend_v1/index.template.html',
    }),
    new ReplaceInFileWebpackPlugin([{
      dir: 'frontend_v1/templates/frontend_v1',
      files: ['index.html'],
      rules: [{
        search: '/frontend_v1/static/',
        replace: '{{SITE_RESOURCES_URL}}'
       }]
    }]),
    new BundleAnalyzerPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, './frontend_v1/static/frontend_v1/scripts/bundles'),
    filename: '[name].bundle.[chunkhash].js',
    chunkFilename: "[name].[chunkhash].js",
    publicPath: '/frontend_v1/static/frontend_v1/scripts/bundles/',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        presets: [
          '@babel/preset-react'
        ]
      }
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    }]
  }
};