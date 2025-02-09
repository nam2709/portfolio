import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
// import { schemaValidator } from 'libs/lambda'
import { Logger } from '@aws-lambda-powertools/logger'

import CartService from 'services/cart.service'
import errorLogger from '@middy/error-logger'
// import { object, string } from 'yup'

const logger = new Logger()

export async function handleRemoveFromCart(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const { id: productId } = event.pathParameters
  // const { productId } = event.body

  const cart = new CartService()

  return cart
    .removeItemFromCart(userId, productId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify('Item removed from cart successfully'),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const removeFromCart = middy(handleRemoveFromCart)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
// .use(schemaValidator({ body: object({ productId: string().required() }) }))
