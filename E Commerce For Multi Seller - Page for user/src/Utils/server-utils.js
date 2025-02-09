// https://aws.amazon.com/blogs/mobile/amplify-javascript-v6/

import { cookies } from 'next/headers'
import {
  generateServerClientUsingCookies,
  generateServerClientUsingReqRes,
} from '@aws-amplify/adapter-nextjs/api'

import config from './amplify.config'
import { createServerRunner } from '@aws-amplify/adapter-nextjs'

// console.log('amplify.config', config)

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
