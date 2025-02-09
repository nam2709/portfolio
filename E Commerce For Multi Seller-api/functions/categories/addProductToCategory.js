import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
// import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
// import { Logger } from '@aws-lambda-powertools/logger'

import CategoryService from 'services/CategoryService'
import errorLogger from '@middy/error-logger'

// const logger = new Logger()

// only vendor can add product to category
export async function handleAddProductToCategory(event) {
  const { claims } = event.requestContext.authorizer
  if (!claims['cognito:groups'].includes('Vendor') && !claims['cognito:groups'].includes('Admin')) {
    throw new createHttpError.Forbidden('User is not a vendor or admin');
  }

  const { categoryId, productId } = event.pathParameters
  const service = new CategoryService()
  return service
    .addProductToCategory({ categoryId, productId })
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Product added to category' }),
    }))
    .catch(error => {
      throw new createHttpError.InternalServerError(error.message)
    })
}

export const addProductToCategory = middy(handleAddProductToCategory)
  .use(httpErrorHandler())
  .use(errorLogger())
  // .use(jsonBodyParser())
  .use(cors())
