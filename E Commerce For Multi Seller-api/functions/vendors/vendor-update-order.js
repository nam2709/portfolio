import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import errorLogger from '@middy/error-logger'
import httpCors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import createHttpError from 'http-errors'

import { isAdmin, isVendor } from 'libs/lambda'
import OrderService from 'services/OrderService'
import ProductService from 'services/ProductService'

export async function handleVendorUpdateOrder(event) {
  if (!(isAdmin(event) || isVendor(event))) {
    throw new createHttpError.Forbidden(
      'Forbidden - Only vendors or Admin can update orders'
    )
  }

  const vendorId = event.requestContext.authorizer.claims.sub
  const orderId = event.pathParameters.id

  const orderService = new OrderService()
  const productService = new ProductService()
  const order = await orderService.getOrderById(orderId)

  if (!isAdmin(event)) {
    if (isVendor(event) && order.vendorId !== vendorId) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: 'Forbidden - Vendor cannot update orders from other vendors or not Admin',
        }),
      };
    }
  }  
  try {
    const updatedOrder = await orderService.updateOrder({
      orderId,
      userId: order.userId,
      order: event.body
    });
  
    if (['COMPLETED', 'DELIVERIED', 'DELIVERED'].includes(updatedOrder?.status)) {
      const products = await orderService.getProductsById(orderId);
      console.log('products', products)
      for (let product of products) {
        const updateProductSell = await productService.updateProductSell(product?.productId || product?.pivot?.productId);
        console.log('updateProductSell', updateProductSell);
      }
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify(updatedOrder),
    }
  } catch (error) {
    console.error('Error updating order:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }    
}

export const vendorUpdateOrder = middy(handleVendorUpdateOrder)
  .use(jsonBodyParser())
  .use(httpCors())
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(httpPartialResponse())