import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import errorLogger from '@middy/error-logger'

import CategoryService from 'services/CategoryService'

export async function handleListCategoriesByProduct(event) {
  const { id: productId } = event.pathParameters
  const service = new CategoryService()
  return service
    .listCategoriesByProduct(productId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify({ categories: res }),
    }))
    .catch(error => {
      throw new createHttpError.InternalServerError(error.message)
    })
}

export const listCategoriesByProduct = middy(handleListCategoriesByProduct)
  .use(httpErrorHandler())
  .use(cors())
  .use(errorLogger())
  .use(httpPartialResponse())
