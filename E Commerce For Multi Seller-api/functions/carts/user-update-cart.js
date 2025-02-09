import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { schemaValidator } from 'libs/lambda'
import CartService from 'services/cart.service'
import { object, string, number } from 'yup'

export async function handleUpdateCart(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const { productId, quantity } = event.body

  const cart = new CartService()

  return cart
    .updateCartItem(userId, productId, quantity)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Attributes),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const updateCart = middy(handleUpdateCart)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(
    schemaValidator({
      body: object({
        productId: string().required().min(1),
        quantity: number().required().positive().integer(),
      }),
    })
  )
