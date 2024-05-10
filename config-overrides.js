const { override, addWebpackPlugin } = require('customize-cra');
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = override(
  addWebpackPlugin(new WebpackMd5Hash())
);
