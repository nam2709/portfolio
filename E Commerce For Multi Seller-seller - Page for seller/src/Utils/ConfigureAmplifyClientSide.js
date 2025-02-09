'use client'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { CookieStorage } from 'aws-amplify/utils'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'

import config from './amplify.config'

if (
  typeof window !== 'undefined' &&
  // process.env.STAGE === 'PRODUCTION' &&
  process.env.NEXT_PUBLIC_LOGROCKET_ID
) {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_ID, {
    release: '1.0.0',
    shouldCaptureIP: true,
    rootHostname: 'kamarket.vn',
  })
  // plugins should also only be initialized when in the browser
  setupLogRocketReact(LogRocket)
}

Amplify.configure(config, { ssr: true })

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage())

export default function ConfigureAmplifyClientSide() {
  return null
}
