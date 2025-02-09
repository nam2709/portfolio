import { NextResponse } from 'next/server'

import { verifyTokens } from '@/app/actions/user'
// import product from '../product.json'

export async function GET(request, { params }) {
  const singleProduct = params.updateId;
  const token = await verifyTokens()
    .then(tokens => tokens?.idToken?.toString())
    .catch(error => {
      console.error('GET TOKEN ERROR', error.message)
      return null
    })
  const product = await fetch(`${process.env.API_URL}/vendor/products/${singleProduct}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())

  return NextResponse.json(product);
}
