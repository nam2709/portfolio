import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import errorLogger from '@middy/error-logger'
import httpCors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import createHttpError from 'http-errors'

import { getProfile } from 'functions/auth/me'
import { OrderStatusMap } from 'entities/OrderEntity'
import { isVendor, isAdmin } from 'libs/lambda'
import OrderService from 'services/OrderService'

export async function handleVendorGetOrder(event) {
  if (!(isAdmin(event) || isVendor(event))) {
    throw new createHttpError.Unauthorized('UnAuthorized - Not Vendor or Admin')
  }

  const vendorId = event.requestContext.authorizer.claims.sub
  const orderId = event.pathParameters.id

  try {
    const orderService = new OrderService()
    const order = await orderService.getOrderById(orderId)

    if (isVendor(event) ? order.vendorId !== vendorId : !isAdmin(event)) {
      throw new createHttpError.NotFound(`Not found order ${orderId}`)
    }

    const consumer = await getProfile({ username: order.userId })
    const products = await orderService.getProductsById(orderId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...order,
        consumer: {
          ...consumer,
          name: consumer?.name || consumer?.email || order.userId,
        },
        products,
      }),
    }
  } catch (error) {
    console.error(error.message)
    throw new createHttpError.InternalServerError(error.message)
  }
}

export const vendorGetOrder = middy(handleVendorGetOrder)
  .use(httpCors())
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(httpPartialResponse())
