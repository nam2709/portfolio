/**
 * Kiểm soát user có thể xem được nội dung của trang cá nhân
 */

import { redirect } from 'next/navigation'
import { fetchAuthSession } from 'aws-amplify/auth/server'

import { cookies } from 'next/headers'
import { runWithAmplifyServerContext } from '@/Utils/server-utils'

import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Spinner } from 'reactstrap'

export default async function layout(props) {
  const pathname = headers().get('next-url')
  // console.log({ pathname })
  try {
    const session = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: contextSpec => fetchAuthSession(contextSpec),
    })
    // console.log('account-layout-session', session)
    if (session?.tokens) {
      return <Suspense fallback={<Spinner />}>{props.children}</Suspense>
    }
  } catch (error) {
    console.log('error', error)
  }

  redirect(`/vi/auth/login?next=${pathname}`)
}
