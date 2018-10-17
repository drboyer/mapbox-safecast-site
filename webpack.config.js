const path = require('path');

module.exports = {
  entry: './src/map.js',
  output: {
    filename: 'map.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  }
};
