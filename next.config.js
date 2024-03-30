/** @type {import('next').NextConfig} */
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

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
    'tsparticles-engine',
    'favicons-webpack-plugin'
  ],
  webpack: (config, { dev }) => {
    config.plugins.push(
        new FaviconsWebpackPlugin({
            logo: './public/favicon.jpg',
            cache: true,
            inject: true,
            favicons: {
                appName: 'Kawori',
                appDescription: 'Kawori website',
                developerName: 'KaworiChan',
                developerURL: null,
                background: '#fff',
                theme_color: '#333',
                icons: {
                    coast: false,
                    yandex: false
                }
            }

        })
    )
    return config
  }
}

module.exports = nextConfig
