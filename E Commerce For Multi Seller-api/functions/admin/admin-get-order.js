import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import errorLogger from '@middy/error-logger'
import httpCors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import createHttpError from 'http-errors'

import VendorService from 'services/vendor.service'
import { isAdmin } from 'libs/lambda'
import OrderService from 'services/OrderService'
import { getProfile } from 'functions/auth/me'
import { OrderStatusMap } from 'entities/OrderEntity'

export async function handleAdminGetOrder(event) {
  if (!isAdmin(event)) {
    throw new createHttpError.Forbidden('User is not an admin')
  }

  const orderId = event.pathParameters.id
  const orderService = new OrderService()
  const vendorService = new VendorService()

  try {
    const order = await orderService.getOrderById(orderId)
    const consumerId = order.userId
    const vendorId = order.vendorId

    const consumer = await getProfile({ username: consumerId })
    const store = await vendorService.getVendor({ userId: vendorId, vendorId })
    const products = await orderService.getProductsById(orderId)
    const shipping_address = order.shipping_address || {}
    const order_status = OrderStatusMap[order?.orderSatus || 'PENDING']

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...order,
        consumer: {
          ...consumer,
          name: consumer?.name || consumer?.email || consumerId,
        },
        shipping_address,
        order_status,
        store,
        products,
      }),
    }
  } catch (error) {
    throw new createHttpError.InternalServerError(error.message)
  }
}

export const adminGetOrder = middy(handleAdminGetOrder)
  .use(httpCors())
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(httpPartialResponse())
