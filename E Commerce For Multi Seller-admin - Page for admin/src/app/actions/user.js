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

export async function verifyAdmin() {
  const session = await verifySession()

  return (
    session &&
    session?.tokens &&
    session?.tokens?.idToken &&
    session?.tokens?.idToken?.payload['cognito:groups']?.includes('Admin')
  )
}

export async function verifyTokens() {
  const session = await verifySession()
  return session?.tokens
}

export async function verifyAuthorization(request) {
  let authorization = request.headers.get('authorization')

  if (!authorization) {
    const token = await verifySession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(error => null)

    if (token) {
      authorization = `Bearer ${token}`
    }
  }

  return authorization
}
