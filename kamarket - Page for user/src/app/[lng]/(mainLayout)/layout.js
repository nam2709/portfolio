// import { cookies } from 'next/headers'
// import { runWithAmplifyServerContext } from '@/Utils/server-utils'
// import { fetchAuthSession } from 'aws-amplify/auth/server'
import MainLayout from '@/Layout'

export default async function RootLayout({ children, params: { lng } }) {
  // console.dir(cookies().getAll())
  // try {
  //   const session = await runWithAmplifyServerContext({
  //     nextServerContext: { cookies },
  //     operation: contextSpec => fetchAuthSession(contextSpec),
  //   })
  //   console.log('main-layout-session', session)
  // } catch (error) {
  //   console.log('error', error)
  // }

  return (
    <>
      <MainLayout lng={lng}>{children}</MainLayout>
    </>
  )
}
