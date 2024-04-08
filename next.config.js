const withTM = require('next-transpile-modules')(['@mui/x-charts']);

module.exports = {
  trailingSlash: true,
  transpilePackages: ['@mui/x-charts'],
};

module.exports = withTM();
