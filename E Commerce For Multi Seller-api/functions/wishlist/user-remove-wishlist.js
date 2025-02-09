import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import { schemaValidator } from 'libs/lambda'
import WishlistService from 'services/WishlistService'
import { object, string } from 'yup'

const schema = {
  body: object({
    productId: string().required(),
  }).required(),
}

export async function handleRemoveFromWishlist(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const { productId } = event.body

  const service = new WishlistService()

  return service
    .removeFromWishlist(userId, productId)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Removed product from wishlist' }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const removeFromWishlist = middy(handleRemoveFromWishlist)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(schemaValidator(schema))
