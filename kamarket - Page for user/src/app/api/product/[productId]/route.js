import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import product from '../product.json'

export async function GET(request) {
  const url = new URL(request.url);
  const productId = url.pathname.split('/').pop();
  const product = await fetch(`${process.env.API_URL}/products/${productId}`)
    .then(res => res.json())
    .catch(error => {
      console.error(error.message)
      return {}
    })

  if (product.status !== "APPROVED") {
    return null
  }
  // console.dir({ params }, { depth: 5 })
  // const productId = params.productId

  // const productObj = product.data?.find(elem => elem.slug == productId)

  return NextResponse.json(product)
}
