import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import { object, string } from 'yup'

import { schemaValidator } from 'libs/lambda'
import WishlistService from 'services/WishlistService'

const schema = {
  body: object({
    productId: string().required(),
  }).required(),
}

export async function handleAddToWishlist(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const { productId } = event.body

  const service = new WishlistService()

  return service
    .addToWishlist(userId, productId)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Added product to wishlist' }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const addToWishlist = middy(handleAddToWishlist)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(errorLogger())
  .use(cors())
  .use(schemaValidator(schema))
