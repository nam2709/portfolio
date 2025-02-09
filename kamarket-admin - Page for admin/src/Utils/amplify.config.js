export const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      username: true,
      email: true,
    },
  },
  API: {
    REST: {
      kamarket: {
        endpoint: process.env.NEXT_PUBLIC_API_URL,
      },
    },
  },
}

export default config
