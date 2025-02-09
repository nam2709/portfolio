import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import ProductService from 'services/ProductService'
export async function handleVendorGetProduct(event) {
  const productId = event.pathParameters.id

  const service = new ProductService()
  return service
    .getById(productId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Item),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const vendorGetProduct = middy(handleVendorGetProduct)
  .use(httpErrorHandler())
  .use(cors())
  .use(errorLogger())
  .use(httpPartialResponse())
