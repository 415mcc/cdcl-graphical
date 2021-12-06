const withTM = require('next-transpile-modules')(['vis-network'])

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
})
