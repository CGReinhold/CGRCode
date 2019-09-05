var path = require('path');

module.exports = {
  entry: {
    app: './src'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cgrcode.js',
    library: 'CGRCode',
    libraryTarget: 'var'
  }
};