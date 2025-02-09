import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import errorLogger from '@middy/error-logger'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'

import OrderService from 'services/OrderService'
import { isVendor } from 'libs/lambda'
import { getProfile } from 'functions/auth/me'
import { OrderStatus, OrderStatusMap, PaymentMethod, PaymentStatus } from 'entities/OrderEntity'

export async function handleVendorListOrders(event) {
  if (!isVendor(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not a vendor' }),
    }
  }
  const vendorId = event.requestContext.authorizer.claims.sub

  const service = new OrderService()
  const query = event.queryStringParameters

  try {
    const orders = await service.listOrdersByVendor(vendorId, query).then(res => res.Items)

    const promises = orders.map(async order => {
      const consumer = await getProfile({ username: order.userId }).catch(error => {
        console.error(`ERROR GET PROFILE USER ${order.userId}`, error.message)
        return null
      })
      // console.log({ consumer_id: order.userId, consumer })

      const status = order?.status || order?.orderStatus || OrderStatus.PENDING
      const payment_status = order?.paymentStatus || order?.payment_status || PaymentStatus.PENDING
      const payment_method = order?.paymentMethod || order?.payment_method || PaymentMethod.COD
      const order_status = order?.order_status || OrderStatusMap[status]

      return {
        order_number: order.orderId,
        created_at: order.createdAt,
        total: order.amount,
        consumer: { name: consumer?.name || consumer?.email || order.userId },
        payment_status,
        payment_method,
        status,
        order_status,
      }
    })

    const result = await Promise.all(promises).catch(console.error)

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result,
        total: result?.length || 0,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

export const vendorListOrders = middy(handleVendorListOrders)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
