import { verifySession } from '@/app/actions/user'
import count from './count.json'
import { NextResponse } from 'next/server'

async function getOrders(Authorization) {
  return await fetch(`${process.env.API_URL}/vendor/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
  })
    .then(res => res.json())
    // .then(res => res.total)
    // .then(({ Items }) => Items)
    .catch(error => {
      console.error(error.message)
      return []
    })
}

async function getProducts(Authorization) {
  return await fetch(`${process.env.API_URL}/vendor/products`, {
    headers: {
      Authorization,
    },
  })
    .then(res => res.json())
    // .then(res => res.length)
    .catch(error => 0)
}

// async function getUsers(Authorization) {
//   return await fetch(`${process.env.API_URL}/vendor/users`, {
//     headers: {
//       Authorization,
//     },
//   })
//     .then(res => res.json())
//     .then(res => res.data.length)
//     .catch(error => 0)
// }

export async function GET(request) {
  let Authorization = request.headers.get('Authorization')
  if (!Authorization) {
    const token = await verifySession()
      .then(session => session?.tokens?.idToken.toString())
      .catch(() => null)
    if (token) {
      Authorization = `Bearer ${token}`
    }
  }

  if (!Authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await getOrders(Authorization)
  const total_orders = orders.total
  const total_revenue = orders.data.reduce((acc, order) => acc + order.total, 0)
  const products = await getProducts(Authorization)
  const total_products = products.length
  // const total_users = await getUsers(Authorization)

  console.dir({ orders, total_revenue, total_orders, total_products }, { depth: 3 })

  return NextResponse.json({
    ...count,
    orders,
    total_revenue,
    total_orders,
    total_products,
    // total_stores,
    // total_users,
  })
}
