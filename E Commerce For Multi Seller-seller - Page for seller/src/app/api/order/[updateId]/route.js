import { verifyTokens } from '@/app/actions/user'
import order from '../order.json'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const singleOrder = params.updateId
  const token = await verifyTokens()
    .then(tokens => tokens?.idToken?.toString())
    .catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })
  const orderObj = await fetch(`${process.env.API_URL}/vendor/orders/${singleOrder}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json())
  return NextResponse.json(orderObj)
}
