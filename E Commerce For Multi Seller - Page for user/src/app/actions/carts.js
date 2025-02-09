// 'use server'
// import { cookies } from 'next/headers'

import { verifySession } from './user'

export async function fetchCart({ accessToken }) {
  return fetch(`${process.env.API_URL}/carts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error('FAILED to fetch cart', error.message)
      return []
    })
}

export async function getCart() {
  const tokens = await verifySession()

  if (!tokens?.accessToken) {
    return null
  }

  return fetchCart({
    accessToken: tokens.accessToken.toString(),
  })
}

export async function addToCart({ productId, vendorId, quantity, product, variation, price }) {
  let token = null
  if (!token) {
    const tokens = await verifySession()
    token = tokens?.idToken
  }

  if (!token) {
    return null
  }
  return fetch(`${process.env.API_URL}/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      vendorId,
      product,
      quantity,
      price,
      variation,
    }),
  })
    .then(res => res.json())
    .catch(error => {
      console.error('FAILED to add to cart', error.message)
      return []
    })
}

export async function checkout(values) {
  // let token = cookies().get('uat')?.value
  let token
  if (!token) {
    const tokens = await verifySession()
    token = tokens?.idToken
  }

  if (!token) {
    return null
  }
  return fetch(`${process.env.API_URL}/carts/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  }).then(res => res.json())
  // .catch(error => {
  //   console.error('FAILED to checkout', error.message)
  //   return []
  // })
}
