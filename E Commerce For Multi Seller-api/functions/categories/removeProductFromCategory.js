import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import eventNormalizer from '@middy/event-normalizer'
import { isAdmin, isVendor } from 'libs/lambda'
import CategoryService from 'services/CategoryService'

export async function handleRemoveProductFromCategory(event) {
  const { claims } = event.requestContext.authorizer;

  if (!(isAdmin(event) || isVendor(event))) {
    throw new createHttpError.Forbidden('User is not authorized. Must be an admin or vendor.');
  }

  const { categoryId, productId } = event.pathParameters || {};
  if (!categoryId || !productId) {
    throw new createHttpError.BadRequest('Missing categoryId or productId');
  }

  const service = new CategoryService()
  return service
    .removeProductFromCategory({ categoryId, productId })
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Product removed from category' }),
    }))
    .catch(error => {
      throw new createHttpError.InternalServerError(error.message)
    })
}

export const removeProductFromCategory = middy(handleRemoveProductFromCategory)
  .use(httpErrorHandler())
  .use(eventNormalizer())
  .use(cors())
