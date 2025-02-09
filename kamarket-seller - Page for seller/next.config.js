/** @type {import('next').NextConfig} */

module.exports = phase => {
  const env = {
    API_PROD_URL: process.env.HOST_API_URL,
  }

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
          hostname: 'kamarket-dev-storage.s3.amazonaws.com',
        },
        {
          protocol: 'https',
          hostname: 'kamarket-prod-storage.s3.amazonaws.com',
        },
      ],
    },
    devIndicators: {
      buildActivity: false,
    },
  }
}
