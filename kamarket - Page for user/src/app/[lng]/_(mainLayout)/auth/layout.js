/**
 * Kiểm soát user có thể xem được nội dung của trang cá nhân
 * Nếu có thông tin người dùng, chuyển qua trang account/dashboard
 * Nếu khôntg có thông tin người dùng, tiếp tục trang
 *
 * TODO: Cần xem xét lại cách xử lý khi link redirect/next page
 */

import { redirect } from 'next/navigation'
import { fetchAuthSession } from 'aws-amplify/auth/server'

import { cookies } from 'next/headers'
import { runWithAmplifyServerContext } from '@/Utils/server-utils'

// This page always dynamically renders per request
export const dynamic = 'force-dynamic'

export default async function layout(props) {
  try {
    const session = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: contextSpec => fetchAuthSession(contextSpec),
    })
    // console.log('auth-layout-session', session)
    if (session?.tokens) {
      redirect(`/vi`, 'push')
    }
  } catch (error) {
    console.log('error', error)
  }

  return <>{props.children}</>
}
