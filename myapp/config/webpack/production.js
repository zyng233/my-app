process.env.NODE_ENV = process.env.NODE_ENV || "production";

const webpackConfig = require("./base");

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
