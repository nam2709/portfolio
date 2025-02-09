import { NextResponse } from 'next/server'
import { verifyTokens } from '@/app/actions/user'

export async function DELETE(_, { params }) {
  const token = await verifyTokens()
    .then(tokens => tokens?.idToken?.toString())
    .catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const address = await fetch(`${process.env.API_URL}/address/${params.addressId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    })

  return NextResponse.json(address, { status: 200 })
}

export async function UPDATE(request, { params }) {
  const token = await verifyTokens()
    .then(tokens => tokens?.idToken?.toString())
    .catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const address = await fetch(`${process.env.API_URL}/address/${params.addressId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    })

  return NextResponse.json(address, { status: 200 })
}
