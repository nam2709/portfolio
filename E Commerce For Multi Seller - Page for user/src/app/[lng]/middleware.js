import { fetchAuthSession } from 'aws-amplify/auth/server'
import { NextRequest, NextResponse } from 'next/server'
import { runWithAmplifyServerContext } from '@/Utils/server-utils'

/**
 * The fetchAuthSession function is used to check if the user is authenticated.
 * If the user is authenticated, the middleware will return the response.
 * If the user is not authenticated, the middleware will redirect the user to the sign-in page.
 */
export async function middleware(request) {
  console.log({ middleware: request })
  const response = NextResponse.next()
  const { lng } = response.nextUrl.query

  const authenticated = await runWithAmplifyServerContext(
    nextServerRequest,
    async contextSpec => {
      try {
        const session = await fetchAuthSession(contextSpec)
        console.log({ amplify_session: session })
        return session.tokens !== undefined
      } catch (error) {
        console.error(error)
        return false
      }
    }
  )
  if (authenticated) {
    return response
  }

  return NextResponse.redirect(new URL(`/${lng}/auth/sign-in`, request.url))
}

export const config = {
  /**
   * Match all request paths except the one starting with:
   * - api (API routes)
   * - _next/static (Next.js static files)
   * - _next/image (Next.js image optimization)
   * - favicon.ico (Favicon)
   */

  match: [`/((?api|_next/static|_next/image|favicon.ico|sign-in).*)`],
}
