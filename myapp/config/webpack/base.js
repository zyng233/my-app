const { webpackConfig } = require("@rails/webpacker");

module.exports = {
  webpackConfig,
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
    },
  },
};
