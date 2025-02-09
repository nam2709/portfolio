import middy from '@middy/core'
import cors from '@middy/http-cors'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import httpCreateError from 'http-errors'
import { Logger } from '@aws-lambda-powertools/logger'

import ProductService from 'services/ProductService'
import errorLogger from '@middy/error-logger'

const logger = new Logger()

export async function handleUpdateProduct(event) {
  const { claims } = event.requestContext.authorizer
  console.dir({ claims }, { depth: 5 })
  if (!claims['cognito:groups'].includes('Vendor')) {
    throw new httpCreateError.Forbidden(
      'Forbidden - Only vendors can update products'
    )
  }

  const vendorId = claims.sub

  const productId = event.pathParameters.id
  const product = event.body

  const service = new ProductService()

  const updatedProduct = await service.updateProduct(
    productId,
    vendorId,
    product
  )
  return {
    statusCode: 200,
    body: JSON.stringify(updatedProduct?.Attributes),
  }
}

export const vendorUpdateProduct = middy(handleUpdateProduct)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(errorLogger())
