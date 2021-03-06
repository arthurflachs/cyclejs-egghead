var path = require('path')

module.exports = {
  entry: path.resolve('index.js'),
  output: {
    filename: 'bundle.js',
    path: '/dist',
    publicPath: '/',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  }
}
