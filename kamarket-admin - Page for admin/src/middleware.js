import { fetchAuthSession } from 'aws-amplify/auth/server'
import { NextRequest, NextResponse } from 'next/server'
import { runWithAmplifyServerContext } from '@/Utils/server-utils'

export async function middleware(request) {
  // Put Your Logic Here
  // const response = NextResponse.next()
  // const authenticated = await runWithAmplifyServerContext({
  //   nextServerContext: { request, response },
  //   operation: async contextSpec => {
  //     try {
  //       const session = await fetchAuthSession(contextSpec)
  //       return session.tokens?.accessToken !== undefined && session.tokens?.idToken !== undefined
  //     } catch (error) {
  //       console.log(error)
  //       return false
  //     }
  //   },
  // })
  // if (authenticated) {
  //   return response
  // }
  // return NextResponse.redirect(new URL('vi/auth/login', request.url))
}

export const config = {
  matcher: [
    '/',
    '/account',
    '/attachment/:path*',
    '/attribute/:path*',
    '/auth/:path*',
    '/blog/:path*',
    '/category/:path*',
    '/checkout',
    '/commission_history',
    '/coupon/:path*',
    '/currency/:path*',
    '/dasboard',
    '/dashboard/:path*',
    '/faq/:path*',
    '/notification/:path*',
    '/order/:path*',
    '/page/:path*',
    '/payment_account/:path*',
    '/point/:path*',
    '/product/:path*',
    '/refund',
    '/review/:path*',
    '/role/',
    '/setting/:path*',
    '/shipping/:path*',
    '/store/:path*',
    '/tag/:path*',
    '/tax/:path*',
    '/theme/:path*',
    '/theme_option/:path*',
    '/user/:path*',
    '/vendore_wallet/:path*',
    '/wallet/:path*',
    '/withdraw_request/:path*',
    '/vendor_wallet/:path*',
    '/theme/denver',
    '/notifications',
    '/qna',
  ],
}
