const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  // PHASE_PRODUCTION_SERVER,
} = require('next/constants')

module.exports = phase => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGE === 'PRODUCTION'
  // when `next build` or `npm run build` is used
  const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGE === 'STAGING'

  // const isServer = phase === PHASE_DEVELOPMENT_SERVER

  const env = {
    API_PROD_URL: (() => {
      // return 'http://localhost:3000/api'
      if (isDev) return 'http://localhost:3000/api/'
      if (isProd) {
        // Note: The code below needs to be uncommented, and you should use your domin where your API is hosted.
        return 'https://kamarket.vn/api/'
      }
      if (isStaging) return 'https://dev.kamarket.vn/api/'
      return 'https://dev.kamarket.vn/api/'
      // return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    API_BASE_URL: 'http://localhost:3000/api',
  }
  const redirects = () => {
    return [
      {
        source: '/',
        destination: '/vi',
        permanent: true,
      },
    ]
  }
  const images = {
    // domains: [
    //   'react.pixelstrap.net',
    //   'res.cloudinary.com',
    //   'down-bs-vn.img.susercontent.com',
    //   'down-vn.img.susercontent.com',
    // ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'react.pixelstrap.net',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'down-vn.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'down-bs-vn.img.susercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'kamarket.vn',
      },
      {
        protocol: 'https',
        hostname: 'dev.kamarket.vn',
      },
      {
        protocol: 'https',
        hostname: 'kamarket-prod-storage.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'kamarket-prod-storage.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'kamarket-dev-storage.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'kamarket-dev-storage.s3.amazonaws.com',
      },
    ],
  }

  console.log({
    env,
    isDev,
    isProd,
    isStaging,
    // isServer,
    phase,
    STAGE: process.env.STAGE,
    NODE_ENV: process.env.NODE_ENV,
  })

  return {
    env,
    redirects,
    images,
  }
}
