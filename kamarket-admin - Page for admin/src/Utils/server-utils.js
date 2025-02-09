// https://aws.amazon.com/blogs/mobile/amplify-javascript-v6/

import { cookies, headers } from 'next/headers'
import {
  generateServerClientUsingCookies,
  generateServerClientUsingReqRes,
} from '@aws-amplify/adapter-nextjs/api'
import { createServerRunner } from '@aws-amplify/adapter-nextjs'

import config from './amplify.config'

export const serverClient = generateServerClientUsingCookies({
  config,
  cookies,
})

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
})

export const serverGraphQLClient = generateServerClientUsingReqRes({
  config,
})

export const getHost = () => {
  const protol = headers().get('x-forwarded-proto') || 'http'
  const host = headers().get('host')

  return `${protol}://${host}`
}
