import React, { useEffect, useReducer, useState } from 'react'
import { fetchAuthSession, fetchUserAttributes, signIn } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { useQuery } from '@tanstack/react-query'
import { useCookies } from 'react-cookie'

import AccountContext from '.'
import request from '../../Utils/AxiosUtils'
import { selfData } from '../../Utils/AxiosUtils/API'

const initAccountDataState = {
  email: undefined,
  name: undefined,
  phone: undefined,
}

const reducer = (state, action) => {
  switch (action?.type) {
    case 'SIGNED_IN':
      return { ...state, ...action.payload }
    case 'SIGNED_OUT':
      return initAccountDataState
    default:
      return state
  }
}

const AccountProvider = props => {
  const [cookies] = useCookies(['uat'])
  const [role, setRole] = useState('')
  const { data, isLoading } = useQuery([selfData], () => request({ url: selfData }), {
    refetchOnWindowFocus: false,
    select: res => {
      return res?.data
    },
  })
  const [accountData, setAccountData] = useReducer(reducer, initAccountDataState)
  const [accountContextData, setAccountContextData] = useState({
    name: '',
    image: {},
  })

  useEffect(() => {
    if (data) {
      localStorage.setItem('role', JSON.stringify(data?.role))
      setRole(data?.role?.name)
    }
    setAccountData(data)
  }, [isLoading, cookies.uat])

  useEffect(() => {
    // autoSignIn().then(console.log).catch(console.error)
    const listener = Hub.listen('auth', event => {
      console.log({ HUB: event })
      switch (event.payload.event) {
        case 'signedIn':
          fetchUserAttributes().then(user => {
            setAccountData({ type: 'SIGNED_IN', payload: user })
          })
          console.log('user have been signedIn successfully.')
          break
        case 'signedOut':
          console.log('user have been signedOut successfully.')
          break
        case 'tokenRefresh':
          console.log('auth tokens have been refreshed.')
          break
        case 'tokenRefresh_failure':
          console.log('failure while refreshing auth tokens.')
          break
        case 'signInWithRedirect':
          console.log('signInWithRedirect API has successfully been resolved.')
          break
        case 'signInWithRedirect_failure':
          console.log('failure while trying to resolve signInWithRedirect API.')
          break
        case 'customOAuthState':
          logger.info('custom state returned from CognitoHosted UI')
          break
      }
    })
    return listener
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      await signIn({ username, password })
      const session = await fetchAuthSession().catch(console.error)

      console.log({ token: session?.tokens?.idToken?.payload })
    } catch (error) {}
  }

  return (
    <AccountContext.Provider
      value={{
        ...props,
        accountData,
        setAccountData,
        accountContextData,
        setAccountContextData,
        role,
        setRole,
        login: handleLogin,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  )
}
export default AccountProvider
