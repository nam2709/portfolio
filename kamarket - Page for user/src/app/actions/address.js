import { verifySession } from './user'
import { cookies } from 'next/headers'

const fetchAddresses = async ({ accessToken }) => {
  return fetch(`${process.env.API_URL}/address`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error.message)
      return []
    })
}

export async function getAddresses() {
  const tokens = await verifySession()
  //   console.log('user-sessions', tokens)

  if (!tokens?.accessToken) {
    //TODO: Redirect to login
    return []
  }

  return fetchAddresses({
    accessToken: tokens.accessToken.toString(),
  })
}

export async function addAddress({ address }) {
  let accessToken = cookies().get('accessToken')?.value

  if (!accessToken) {
    const tokens = await verifySession()
    if (!tokens?.accessToken) {
      return false
    }
    accessToken = tokens.accessToken.toString()
  }

  return fetch(`${process.env.API_URL}/address`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error.message)
      throw error
    })
}
