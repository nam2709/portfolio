import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifySession } from '@/app/actions/user'

const statusMap = {
  PENDING: {
    id: 1,
    name: 'pending',
    slug: 'pending',
    sequence: 1,
    status: 1,
  },
  PROCESSING: {
    id: 2,
    name: 'processing',
    slug: 'processing',
    sequence: '2',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  SHIPPED: {
    id: 4,
    name: 'shipped',
    slug: 'shipped',
    sequence: '4',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  OUR_FOR_DELIVERY: {
    id: 5,
    name: 'out for delivery',
    slug: 'out-for-delivery',
    sequence: '5',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  DELIVERIED: {
    id: 6,
    name: 'delivered',
    slug: 'delivered',
    sequence: '6',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  COMPLETED: {
    id: 6,
    name: 'delivered',
    slug: 'delivered',
    sequence: '6',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
}

function getOrderStatus(status) {}

export async function GET(request, { params }) {
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

  return await fetch(`${process.env.API_URL}/orders/${params.orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
  })
    .then(res => res.json())
    .then(json => {
      const products = json?.products?.map(product => {
        return {
          is_return: 0,
          name: product.product?.name || product.product?.product?.name,
          product_thumbnail:
            product.product?.product_thumbnail || product.product?.product?.product_thumbnail,
          pivot: {
            is_refunded: 0,
            single_price: product.price,
            quantity: product.quantity,
            subtotal: product.price * product.quantity,
            // variation: {
            //   name: product.variation,
            //   variation_image: product.image,
            // },
          },
        }
      })
      return {
        ...json,
        products,
        status: json?.status === 'PENDING' ? 1 : 2,
        created_at: json?.created_at || json?.createdAt,
        payment_method: json?.payment_method,
        payment_status: json?.paymentStatus,
        store: {},
        consumer: {},
        order_status: statusMap[json?.status || 'PENDING'] || {},
        shipping_address: json.shipping_address || {
          phone: '0917230586',
          street: 'Hoàng Thành',
          ward: 'Phường Mỗ Lao',
          district: 'Quận Hà Đông',
          city: 'Hà Nội',
        },
      }
    })
    .then(order => {
      // console.dir({ ORDER_DETAIL: order }, { depth: 3 })
      return NextResponse.json(order)
    })
    .catch(error => {
      return NextResponse.json({ error: error.message }, { status: 500 })
    })

  // return NextResponse.json(orderObj)
}
