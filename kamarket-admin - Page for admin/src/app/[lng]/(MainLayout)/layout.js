import { redirect } from 'next/navigation'

import Layout from '@/Layout'
import { verifySession } from '@/app/actions/user'

function isAdmin(session) {
  return (
    session &&
    session?.tokens &&
    session?.tokens?.idToken &&
    session?.tokens?.idToken?.payload['cognito:groups']?.includes('Admin')
  )
}

export default async function RootLayout({ children, params: { lng } }) {
  const session = await verifySession().catch(() => null)

  if (!isAdmin(session)) {
    redirect(`/${lng}/auth/login`)
  }

  console.log('Admin logged in. Show content')

  return <Layout lng={lng}>{children}</Layout>
}
