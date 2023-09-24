// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

const withEnv = require('next-env');

module.exports = withEnv({
  env: {
    // The environment variables that will be loaded from the .env file
  },
});
