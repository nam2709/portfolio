import { sortBy, reverse } from 'lodash'

// import order from './order.json'
import { verifyAuthorization, verifySession } from '@/app/actions/user'
import { NextResponse } from 'next/server'

// export const config = {
//     api: {
//         responseLimit: '8mb',
//     },
// }
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  console.log({ GET_ORDERS_PARAMS: searchParams })
  const authorization = await verifyAuthorization(request)

  if (!authorization) {
    return NextResponse.json({ message: 'UnAuthorized' }, { status: 401 })
  }

  return await fetch(`${process.env.API_URL}/admin/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
  })
    .then(res => res.json())
    .then(res => {
      console.dir({ GET_ORDERS_RESPONSE: res }, { depth: 4 })
      return NextResponse.json(res)
    })
    .catch(error => {
      console.error(error.message)
      return NextResponse.json({ message: error.message }, { status: 500 })
    })
}
