import { redirect } from 'next/navigation'

import AuthLayout from '@/Layout/AuthLayout'
import { isAdmin } from '@/Utils/libs'
import { verifySession } from '@/app/actions/user'

export default async function Layout({ children, params: { lng } }) {
  const session = await verifySession().catch(() => null)
  // console.log({ lng })

  if (isAdmin(session)) {
    console.log('THIS IS ADMIN - LOGGEG IN. REDIRECT TO DASHBOARD')
    redirect(`/${lng}/dashboard`)
  } else if (session?.tokens) {
    console.log('USER IS NOT ADMIN. LOG OUT')
    // await signOut()
    // redirect(`/${lng}/auth/login`)
  }

  return <AuthLayout lng={lng}>{children}</AuthLayout>
}
