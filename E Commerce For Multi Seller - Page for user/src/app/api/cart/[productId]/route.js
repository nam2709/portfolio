import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { verifyToken } from '@/app/actions/user'

export async function DELETE(_, { params }) {
  let token = headers().get('authorization')?.split(' ')?.pop()
  if (!token) {
    token = await verifyToken().catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })
  }

  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await fetch(`${process.env.API_URL}/carts/${params.productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())

    console.log(`DELETED_CART_${params.productId}`, result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('DELETE CART ERROR', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  let token = headers().get('authorization')?.split(' ')?.pop()
  if (!token) {
    token = await verifyToken().catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })
  }

  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  try {
    const result = await fetch(`${process.env.API_URL}/carts/${params.productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then(res => res.json())

    console.log(`UPDATED_CART_${params.productId}`, result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('UPDATE CART ERROR', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
