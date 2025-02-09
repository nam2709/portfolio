import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import eventNormalizer from '@middy/event-normalizer'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import errorLogger from '@middy/error-logger'
import createHttpError from 'http-errors'

import OrderService from 'services/OrderService'
import { isAdmin } from 'libs/lambda'
import { getProfile } from 'functions/auth/me'
import VendorService from 'services/vendor.service'
import { OrderStatus, OrderStatusMap, PaymentMethod, PaymentStatus } from 'entities/OrderEntity'
import { sortBy } from 'lodash'

async function getOrderDetail(order) {
  const consumer = await getProfile({ username: order.userId }).catch(error => {
    console.error('ERROR GET PROFILE', error.message)
    return {}
  })

  const vendorId = order?.vendorId
  const vendor = await new VendorService()
    .getVendor({
      userId: vendorId,
      vendorId,
    })
    .then(res => res.Item)
    .catch(error => {
      console.error('ERROR WHILE READING VENDOR', error.message)
      return null
    })

  const id = order.orderId
  const created_at = order?.created_at || order.createdAt
  const total = order?.total || order?.amount
  const order_number = order.orderId
  const order_status = OrderStatusMap[order.status || OrderStatus.PENDING]
  const payment_status = order.payment_status || PaymentStatus.PENDING
  const payment_method = order.payment_method || PaymentMethod.COD

  return {
    // ...order,
    id,
    order_number,
    created_at,
    total,
    order_status,
    payment_status,
    payment_method,
    consumer: {
      ...consumer,
      name: consumer?.name || consumer?.email || id,
    },
    store: vendor,
  }
}

export async function handleAdminListOrders(event) {
  if (!isAdmin(event)) {
    throw new createHttpError.Forbidden('User is not an admin')
  }

  const orderService = new OrderService()
  const vendorService = new VendorService()

  const query = event.queryStringParameters

  try {
    const res = await orderService.adminListOrders(query).then(res => res.Items)
    const promises = res.map(async order => await getOrderDetail(order))
    const data = await Promise.all(promises)
    const result = sortBy(data, ['created_at']).reverse()

    return {
      statusCode: 200,
      body: JSON.stringify({ data: result, total: result?.length || 0 }),
    }
  } catch (error) {
    throw new createHttpError.InternalServerError(error.message)
  }
}

export const adminListOrders = middy(handleAdminListOrders)
  .use(httpErrorHandler())
  .use(eventNormalizer())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
