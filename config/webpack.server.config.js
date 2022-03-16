const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const base = require('./webpack.base.config');

module.exports = merge(base, {
  target: 'node',
  // 对 bundle renderer 提供 source map 支持
  devtool: '#source-map',
  entry: {
    server: path.resolve(__dirname, '../src/entry-server.js'),
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  // 不需要打包node_modules中的依赖
  externals: [nodeExternals()],
  plugins: [
    new VueSSRServerPlugin(), // 这个要放到第一个写，否则 CopyWebpackPlugin 不起作用，原因还没查清楚
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.ssr.html'),
      filename: 'index.ssr.html',
      files: {
        js: 'client.bundle.js',
      },
      excludeChunks: ['server'],
    }),
  ],
});
