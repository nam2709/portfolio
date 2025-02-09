import 'server-only'
import { cookies } from 'next/headers'
import { runWithAmplifyServerContext } from '@/Utils/server-utils'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server'

export const verifySession = async () => {
  const session = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: contextSpec => fetchAuthSession(contextSpec),
  })

  return session?.tokens
}

export const verifyUser = async () => {
  const user = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: contextSpec => getCurrentUser(contextSpec),
  })

  return user
}

export const verifyToken = async () => {
  const session = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: contextSpec => getCurrentUser(contextSpec),
  })

  return session?.tokens?.idToken.toString()
}

export const verifyTokens = async () => {
  const session = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: contextSpec => fetchAuthSession(contextSpec),
  })

  return session?.tokens
}
