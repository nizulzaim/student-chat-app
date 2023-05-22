module.exports = function (options) {
  return {
    ...options,
    optimization: {
      ...options.optimization,
      minimize: false,
    },
  };
};
