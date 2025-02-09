import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { verifyTokens } from '@/app/actions/user'

export async function POST(request) {
  let token = headers().get('authorization')?.split(' ')?.pop()
  if (!token) {
    token = await verifyTokens()
      .then(tokens => tokens?.idToken?.toString())
      .catch(error => {
        console.error('GET TOKEN ERROR', error.message)
        return null
      })
  }

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  try {
    const response = await fetch(`${process.env.API_URL}/carts/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then(res => {
      console.log('CART POST RESPONSE', res.status, res.statusText)
      return res.json()
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // .catch(error => {})
}
