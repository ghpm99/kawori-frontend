/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    'antd',
    '@ant-design',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip' ,
    'rc-tree',
    'rc-table',
    '@tsparticles',
    'tsparticles',
    'tsparticles-engine'
  ]
}

module.exports = nextConfig
