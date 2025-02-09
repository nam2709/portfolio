import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import errorLogger from '@middy/error-logger'

import CategoryService from 'services/CategoryService'

export async function handleListCategoriesByBook(event) {
  const { id: bookId } = event.pathParameters
  console.log('bookId', bookId)
  const service = new CategoryService()
  return service
    .listCategoriesByBook(bookId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify({ categories: res }),
    }))
    .catch(error => {
      throw new createHttpError.InternalServerError(error.message)
    })
}

export const listCategoriesByBook = middy(handleListCategoriesByBook)
  .use(httpErrorHandler())
  .use(cors())
  .use(errorLogger())
  .use(httpPartialResponse())
