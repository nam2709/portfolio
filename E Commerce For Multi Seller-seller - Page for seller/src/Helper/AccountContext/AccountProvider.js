import React, { useEffect, useState, useReducer } from 'react'
import { Hub } from 'aws-amplify/utils'
import { useQuery } from '@tanstack/react-query'
import { useCookies } from 'react-cookie'

import AccountContext from '.'
import request from '../../Utils/AxiosUtils'
import { selfData } from '../../Utils/AxiosUtils/API'
import { fetchAuthSession, fetchUserAttributes, signOut } from 'aws-amplify/auth'
import { isVendor } from '@/Utils/libs'

const initAccountDataState = {
  status: undefined,
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
  const [role, setRole] = useState('vendor')
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
    fetchAuthSession().then(session => {
      if (!isVendor(session)) {
        if (session?.tokens) {
          return signOut() //.catch(error => console.error('Error while sign out', error.message))
          //throw new Error('User is not a vendor')
        } else {
          const payload = session.tokens?.idToken?.payload
          setAccountData({
            type: 'SIGNED_IN',
            payload: {
              email: payload?.email,
              name: payload?.name,
              phone: payload?.phone_number,
              // group: payload['cognito:groups'],
              // vendorId: payload?.custom?.vendorId,
            },
          })
          // fetchUserAttributes()
          //   .then(user => {
          //     console.log('FOUND SIGNED_IN USER', user)
          //     setAccountData({ type: 'SIGNED_IN', payload: { ...user, status: 'SIGNED_IN' } })
          //   })
          //   .catch(error => console.error('While fetching user attributes', error.message))
        }
      }
    })
  }, [])

  useEffect(() => {
    const listener = Hub.listen('auth', event => {
      console.log({ HUB: event })
      switch (event.payload.event) {
        case 'signedIn':
          fetchUserAttributes()
            .then(user => {
              console.log('SIGNED_IN USER', user)
              setAccountData({ type: 'SIGNED_IN', payload: { ...user, status: 'SIGNED_IN' } })
            })
            .catch(error => console.error('While fetching user attributes', error.message))
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

  //   useEffect(() => {
  //     if (data) {
  //       localStorage.setItem('role', JSON.stringify(data?.role))
  //       setRole(data?.role?.name)
  //     }
  //     setAccountData(data)
  //   }, [isLoading, cookies.uat])

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
      }}
    >
      {props.children}
    </AccountContext.Provider>
  )
}
export default AccountProvider
