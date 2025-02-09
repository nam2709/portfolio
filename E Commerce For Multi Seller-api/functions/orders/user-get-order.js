import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import OrderService from 'services/OrderService'
import VendorService from 'services/vendor.service'
import ProductService from 'services/ProductService'
import { getProfile } from 'functions/auth/me'

export async function handleGetOrder(event) {
  const { claims } = event.requestContext.authorizer
  const userId = claims.sub
  const orderId = event.pathParameters.id

  const orderService = new OrderService()
  const vendorService = new VendorService()
  const productService = new ProductService()

  const { Items } = await orderService.getOrder({ userId, orderId })
  // .then(res => res.Items)
  let order = {}
  const products = []
  Items.forEach(item => {
    if (item.EntityType === 'ORDER_ITEM') {
      products.push(item)
    } else if (item.EntityType === 'ORDER') {
      order = item
    }
  })
  // products.map(p => console.log(p.productId))

  let vendorId = order?.vendorId || products[0]?.vendorId
  if (!vendorId) {
    const productId = products[0]?.productId
    vendorId = await productService
      .getProduct(productId)
      .then(p => {
        console.log({ productId: p.productId, vendorId: p.vendorId })
        return p?.vendorId
      })
      .catch(error => {
        console.error('ERROR WHILE READING PRODUCT', error.message)
        return null
      })
  }
  console.dir({ vendorId, productId: products[0].productId })

  const store = vendorId
    ? await vendorService
        .getVendor({ userId: vendorId, vendorId })
        .then(res => {
          console.log({ STORE: res })
          return res?.Item
        })
        .catch(error => {
          console.error('ERROR WHILE READING VENDOR', error.message)
          return null
        })
    : {}
  console.dir({ store })

  const consumer = await getProfile({ username: userId }).catch(error => {})
  console.dir({ consumer })

  return {
    statusCode: 200,
    body: JSON.stringify({ ...order, store, consumer, products }),
  }
}

export const userGetOrder = middy(handleGetOrder)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(httpPartialResponse())
  .use(cors())
