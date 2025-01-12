module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      http: false,
      https: false,
      url: false,
      util: false,
      zlib: false,
      stream: false,
      assert: false,
      crypto: false,
      os: false,
      path: false,
      fs: false,
      net: false,
      tls: false
    }
  };

  return config;
}; 