const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "url": require.resolve("url/"),
    },
  },
  entry: './src/index.js', // Entry point of your application
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'), // Output directory
    publicPath: '/', // Ensure the public path is correct for your server setup
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Other loaders like file-loader, url-loader, etc., if needed
    ],
  },
  plugins: [
    // Add any necessary plugins here
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000,
    historyApiFallback: true, // For single-page applications
  },
};
