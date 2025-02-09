import { verifyAuthorization, verifySession } from '@/app/actions/user'
import order from '../order.json'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const authorization = await verifyAuthorization(request)

  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const singleOrderId = params.updateId

  return await fetch(`${process.env.API_URL}/orders/${singleOrderId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
  })
    .then(res => res.json())
    .then(res => {
      // console.dir({ ADMIN_SING_ORDER: res })
      return NextResponse.json(res)
    })
    .catch(error => {
      console.error(error.message)
      return NextResponse.json({ message: error.message }, { status: 500 })
    })
}
