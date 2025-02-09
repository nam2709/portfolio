import { fetchAuthSession } from 'aws-amplify/auth'

export const config = {
  Auth: {
    Cognito: {
      // region: process.env.REGION || 'us-east-2',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      // userPoolClientSecret: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_SECRET,
      allowGuestAccess: true,
      signUpVerificationMethod: 'code',
      username: true,
      email: true,
    },
  },
  API: {
    REST: {
      kamarket: {
        endpoint: process.env.NEXT_PUBLIC_API_URL,
        // headers: async () => {
        //   return {
        //     Authorization: `Bearer ${(
        //       await fetchAuthSession()
        //     ).tokens?.accessToken?.toString()}`,
        //   }
        // },
      },
    },
  },
}

export default config
