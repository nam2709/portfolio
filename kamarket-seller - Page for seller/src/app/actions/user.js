'use server'
import { cookies } from 'next/headers'
import { runWithAmplifyServerContext } from '@/Utils/server-utils'
import { fetchAuthSession } from 'aws-amplify/auth/server'

export async function verifySession() {
  const session = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: contextSpec => fetchAuthSession(contextSpec),
  })

  return session
}

export async function verifyVendor() {
  const session = await verifySession()

  return (
    session &&
    session?.tokens &&
    session?.tokens?.idToken &&
    session?.tokens?.idToken?.payload['cognito:groups']?.includes('Vendor')
  )
}

export async function verifyTokens() {
  const session = await verifySession()
  return session?.tokens
}
