// import product from './product.json'
import { verifyAuthorization, verifySession } from '@/app/actions/user'
// import { product } from '@/Utils/AxiosUtils/API'
import { NextResponse } from 'next/server'

export async function GET(request) {
  let authorization = await verifyAuthorization(request)

  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized', data: [], total: 0 }, { status: 401 })
  }

  const products = await fetch(`${process.env.API_URL}/admin/products`, {
    headers: {
      Authorization: authorization,
    },
  })
    .then(response => response.json())
    .then(products => {
      console.dir({ ADMIN_PRODUCTS: products }, { depth: 3 })
      return products.map(p => ({
        ...p,
        status: p.status === 'APPROVED' ? 1 : 0,
        product_status: p.status,
        product_thumbnail: { original_url: p.product_thumbnail?.url },
      }))
    })
    .catch(error => {
      console.error('ERROR while fetching products', JSON.stringify(error))
      return []
    })

  console.dir({ data: products, total: products.length || 0 }, { depth: 3 })
  return NextResponse.json({ data: products, total: products?.length || 0 })
}
