import { verifyAuthorization, verifySession } from '@/app/actions/user'
// import store from './store.json'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  console.log({ GET_STORES_PARAMS: searchParams })
  const authorization = await verifyAuthorization(request)

  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vendors = await fetch(`${process.env.API_URL}/admin/vendors`, {
    headers: {
      Authorization: authorization,
    },
  })
    .then(res => res.json())
    // .then(({ Items }) => {
    //   console.dir({ STORES: Items })
    //   return Items.map(item => {
    //     let result = {}
    //     result.id = item.vendorId
    //     result.vendorId = item.vendorId
    //     result.store_name = item.name
    //     result.email = item.email
    //     result.phone = item.phone
    //     result.address = item.address
    //     result.created_at = item.createdAt
    //     result.updated_at = item.updatedAt
    //     result.is_approved = item.status === 'APPROVED' ? 1 : 0
    //     ;(result.vendor = {
    //       name: item.name,
    //     }),
    //       (result.store_logo = {
    //         id: 1452,
    //         collection_name: 'attachment',
    //         name: '04',
    //         file_name: '04.png',
    //         mime_type: 'image/png',
    //         disk: 'public',
    //         conversions_disk: 'public',
    //         size: '13034',
    //         created_by_id: '1',
    //         created_at: '2023-09-22T08:52:17.000000Z',
    //         updated_at: '2023-09-22T08:52:17.000000Z',
    //         original_url: '/assets/images/data/product.png',
    //       })
    //     return result
    //   })
    // })
    .catch(error => [])

  console.dir({ data: vendors, total: vendors.length || 0 }, { depth: 3 })

  return NextResponse.json({ data: vendors, total: vendors?.length || 0 })
}
