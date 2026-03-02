const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js', // Точка входа
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'popover.bundle.js',
    clean: true, // Очищает dist перед сборкой
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            sourceType: 'module',
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Обработка CSS
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Исходный HTML
      filename: 'index.html', // Выходной HTML в dist
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9001,
    open: true, // Автоматически открывает браузер
    hot: true, // Горячая перезагрузка
  },
  mode: 'development',
};
