const path = require('path');

module.exports = {
  target: 'electron-main',
  entry: './src/main/main.ts',
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@main': path.resolve(__dirname, '../main'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist/main'),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};