import httpErrorHandler from '@middy/http-error-handler'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import { Logger } from '@aws-lambda-powertools/logger'

import ProductService from 'services/ProductService'
import errorLogger from '@middy/error-logger'

const logger = new Logger()

export async function handleGetProduct(event) {
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

export const getProduct = middy(handleGetProduct)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
