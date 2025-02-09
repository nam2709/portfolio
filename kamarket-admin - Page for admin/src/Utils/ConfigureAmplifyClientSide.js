'use client'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { CookieStorage } from 'aws-amplify/utils'

import config from './amplify.config'

Amplify.configure(config, { ssr: true })

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage())

export default function ConfigureAmplifyClientSide() {
  return null
}
