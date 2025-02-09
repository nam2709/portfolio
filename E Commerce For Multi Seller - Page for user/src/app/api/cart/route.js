import emptyCart from './cart.json'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/app/actions/user'
import { headers } from 'next/headers'

// Get User Cart
export async function GET() {
  let token = headers().get('authorization')?.split(' ')?.pop()
  if (!token) {
    token = await verifyToken().catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })
  }

  if (!token) return NextResponse.json(emptyCart)

  const result = await fetch(`${process.env.API_URL}/carts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(json => {
      return {
        items: json,
        total: 0,
      }
    })
    .catch(error => {
      console.error('GET CART ERROR', error.message)
      return emptyCart
    })

  console.dir({
    GET_CART: result?.items?.map(({ productId, name, slug, vendorId, quantity, price }) => ({
      id: productId,
      productId,
      name,
      slug,
      vendorId,
      quantity,
      price,
    })),
  })

  result.total = result.items.reduce()

  return NextResponse.json(result)
}
1
// Add To Cart
export async function POST(request) {
  let token = headers().get('authorization')?.split(' ')?.pop()
  if (!token) {
    token = await verifyToken().catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })
  }

  // console.log({ CART_TOKEN: token })

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  console.dir({ ADD_TO_CART: body }, { depth: 1 })

  let item
  try {
    item = await fetch(`${process.env.API_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then(res => res.json())
  } catch (error) {
    console.error('ERROR WHILE ADD TO CART', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(item, { status: 200 })
}
