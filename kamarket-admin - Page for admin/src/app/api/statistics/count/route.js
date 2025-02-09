import { verifyAuthorization, verifySession } from '@/app/actions/user'
import count from './count.json'
import { NextResponse } from 'next/server'

async function getOrders(Authorization) {
  return await fetch(`${process.env.API_URL}/admin/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error.message)
      return { data: [], total: 0 }
    })
}

async function getVendors(Authorization) {
  return await fetch(`${process.env.API_URL}/admin/vendors`, {
    headers: {
      Authorization,
    },
  })
    .then(res => res.json())
    .then(res => res.length)
    .catch(error => 0)
}

async function getUsers(Authorization) {
  return await fetch(`${process.env.API_URL}/admin/users`, {
    headers: {
      Authorization,
    },
  })
    .then(res => res.json())
    .then(res => res.data.length)
    .catch(error => 0)
}

export async function GET(request) {
  const Authorization = await verifyAuthorization(request)

  if (!Authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await getOrders(Authorization)
  const total_orders = orders.total
  const total_revenue = orders.data.reduce((acc, order) => acc + order.total, 0)
  const total_stores = await getVendors(Authorization)
  const total_users = await getUsers(Authorization)

  console.dir( total_stores , { depth: 3 })

  return NextResponse.json({
    ...count,
    orders,
    total_revenue,
    total_orders,
    total_stores,
    total_users,
  })
}
