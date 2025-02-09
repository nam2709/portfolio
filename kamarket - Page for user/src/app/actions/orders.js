import 'server-only'
import { verifySession } from './user'

export async function fetchOrders({ accessToken }) {
  return fetch(`${process.env.API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error('FAILED to fetch orders', error.message)
      return []
    })
}

export async function fetchOrderDetail({ accessToken, orderId }) {
  return fetch(`${process.env.API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error('FAILED to fetch order detail', error.message)
      return null
    })
}

export async function getOrders() {
  const tokens = await verifySession()

  if (!tokens?.accessToken) {
    //TODO: Redirect to login
    // throws error unauthorized
    return []
  }

  return fetchOrders({
    accessToken: tokens.accessToken.toString(),
  })
}

export async function getOrderDetail(orderId) {
  const tokens = await verifySession()

  if (!tokens?.accessToken) {
    //TODO: Redirect to login
    // throws error unauthorized
    return null
  }

  return fetchOrderDetail({
    accessToken: tokens.accessToken.toString(),
    orderId,
  })
}
