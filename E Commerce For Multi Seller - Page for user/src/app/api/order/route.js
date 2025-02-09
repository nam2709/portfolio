import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { verifyToken } from '@/app/actions/user'

export async function GET(request) {
  let authorization = request.headers.get('authorization')
  if (!authorization) {
    const token = await verifySession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // console.log({ GET_ORDER_DETAIL_TOKEN: token, params })

    authorization = `Bearer ${token}`
  }

  const searchParams = request.nextUrl?.searchParams
  const page = searchParams.get('page')
  const paginate = searchParams.get('paginate')
  const status = searchParams.get('status')

  // console.log('get-orders-data', { page, paginate })

  return await fetch(`${process.env.API_URL}/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
  })
    .then(res => res.json())
    .then(orders => {
      console.log(orders)
      console.log('status', status)
      if (status !== 'undefined') {
        console.log('status', status)
        const order = orders.filter(order => order.order_status.slug === status);
        return NextResponse.json({ current_page: 1, data: order, total: 1 })
      }
      console.log('ordersordersordersordersorders', orders)
      return NextResponse.json({ current_page: 1, data: orders, total: 1 })
    })
    .catch(error => {
      console.error('ERROR GET ORDERS', error.message)
      return NextResponse.json({ error: 'Error while fetching orders' }, { status: 500 })
    })
}
