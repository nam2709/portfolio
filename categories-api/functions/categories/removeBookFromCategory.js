import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import eventNormalizer from '@middy/event-normalizer'
import { isAdmin, isVendor } from 'libs/lambda'
import CategoryService from 'services/CategoryService'

export async function handleRemoveBookFromCategory(event) {
  // const { claims } = event.requestContext.authorizer;

  // if (!(isAdmin(event) || isVendor(event))) {
  //   throw new createHttpError.Forbidden('User is not authorized. Must be an admin or vendor.');
  // }

  const { categoryId, bookId } = event.pathParameters || {};
  if (!categoryId || !bookId) {
    throw new createHttpError.BadRequest('Missing categoryId or bookId');
  }

  const service = new CategoryService()
  return service
    .removeBookFromCategory({ categoryId, bookId })
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'book removed from category' }),
    }))
    .catch(error => {
      throw new createHttpError.InternalServerError(error.message)
    })
}

export const removeBookFromCategory = middy(handleRemoveBookFromCategory)
  .use(httpErrorHandler())
  .use(eventNormalizer())
  .use(cors())
