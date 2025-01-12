const path = require('path');

module.exports = {
  // ... existing config ...
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "assert": false,
      "url": false
    }
  }
}; 