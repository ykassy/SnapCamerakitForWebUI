const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'packed.js',
    path: path.resolve(__dirname, 'docs'),
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    client: {
      overlay: false
    },
    compress: true,
    port: 9001,
    allowedHosts: 'all', // すべてのホストを許可
    server: 'https', // HTTPSを有効化
  },
};