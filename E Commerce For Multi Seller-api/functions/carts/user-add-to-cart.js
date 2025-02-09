import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import CartService from 'services/cart.service'
import { object, string, number } from 'yup'
import { schemaValidator } from 'libs/lambda'

const schema = object({
  body: object({
    productId: string().required(),
    quantity: number().required().positive().integer(),
    price: number().required().positive().integer(),
  }).required(),
})

export async function handleAddToCart(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const { productId, quantity, price, product, vendorId } = event.body

  const cart = new CartService()
  return cart
    .addToCart({ userId, vendorId, productId, quantity, price, product })
    .then(() => cart.getCartItem(userId, productId))
    .then(res => res.Item)
    .then(Item => ({
      statusCode: 200,
      body: JSON.stringify(Item),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const addToCart = middy(handleAddToCart)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(
    schemaValidator({
      body: object({
        productId: string().required().min(1),
        vendorId: string().required().min(1),
        quantity: number().required().positive().integer(),
        price: number().required().positive().integer(),
      }).required(),
    })
  )
