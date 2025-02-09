/** @type {import('next').NextConfig} */

module.exports = phase => {
  const env = {
    API_URL: process.env.API_URL,
    API_PROD_URL: process.env.HOST_API_URL,
  }

  // console.log({ phase, env })

  return {
    reactStrictMode: false,
    swcMinify: true,
    env,
    redirects: async () => {
      return [
        {
          source: '/',
          destination: '/vi/auth/login',
          permanent: true,
        },
        {
          source: '/vi',
          destination: '/vi/auth/login',
          permanent: true,
        },
      ]
    },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1:8000',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1:3000',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1:3007',
        },
        {
          protocol: 'https',
          hostname: 'Kamarket-admin-json.vercel.app',
        },
        {
          protocol: 'https',
          hostname: 'laravel.pixelstrap.net',
        },
        {
          protocol: 'https',
          hostname: 'down-vn.img.susercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'react.pixelstrap.net',
        },
        {
          protocol: 'https',
          hostname: 'kamarket-dev-storage.s3.amazonaws.com',
        },
        {
          protocol: 'https',
          hostname: 'kamarket-dev-storage.s3.ap-southeast-2.amazonaws.com',
        },
        {
          protocol: 'https',
          hostname: 'kamarket-prod-storage.s3.amazonaws.com',
        },
        {
          protocol: 'https',
          hostname: 'kamarket-prod-storage.s3.ap-southeast-1.amazonaws.com',
        },
      ],
    },
    devIndicators: {
      buildActivity: false,
    },
  }
}
