'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Container } from 'reactstrap'
import { fetchAuthSession } from 'aws-amplify/auth'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { ToastContainer } from 'react-toastify'
import ConvertPermissionArr from '../Utils/CustomFunctions/ConvertPermissionArr'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'
import { replacePath } from '../Utils/CustomFunctions/ReplacePath'
import I18NextContext from '@/Helper/I18NextContext'

const Layout = props => {
  const { i18Lang, setI18Lang } = useContext(I18NextContext)
  useEffect(() => {
    if (i18Lang == '') {
      setI18Lang(props.lng)
    }
  }, [props.lng])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mode, setMode] = useState(false)
  const [ltr, setLtr] = useState(true)
  const router = useRouter()
  const path = usePathname()
  let data1 = {}
  const ISSERVER = typeof window === 'undefined'
  if (!ISSERVER) {
    data1 = localStorage.getItem('account') && JSON.parse(localStorage.getItem('account'))
    // Only initialize LogRocket if in a browser and the environment is production
    if (
      typeof window !== 'undefined' &&
      process.env.STAGE === 'PRODUCTION' &&
      process.env.NEXT_PUBLIC_LOGROCKET_ID
    ) {
      LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_ID, {
        release: process.env.NEXT_PUBLIC_VERSION,
        rootHostname: window.location.origin,
        shouldCaptureIP: true,
      })
      // plugins should also only be initialized when in the browser
      setupLogRocketReact(LogRocket)
    }
  }
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    mode ? document.body.classList.add('dark-only') : document.body.classList.remove('dark-only')
  }, [mode, ltr])
  useEffect(() => {
    const securePaths = mounted && ConvertPermissionArr(data1?.permissions)
    if (mounted && !securePaths.find(item => item?.name == replacePath(path?.split('/')[2]))) {
      router.push(`/403`)
    }
  }, [data1])

  useEffect(() => {
    fetchAuthSession()
      .then(async session => {
        if (
          !session ||
          !session?.tokens ||
          !session?.tokens?.idToken ||
          !session?.tokens?.idToken?.payload['cognito:groups'].includes('Admin')
        ) {
          await signOut()
          router.push(`/${i18Lang}/auth/login`)
        }
      })
      .catch(error => {
        router.push(`/${i18Lang}/auth/login`)
      })
  }, [])

  return (
    <>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setMode={setMode}
          setLtr={setLtr}
          settingData={'settingData'}
        />
        <div className="page-body-wrapper">
          <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
          <div className="page-body">
            <Container fluid={true}>{props.children}</Container>
            <Footer />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Layout
