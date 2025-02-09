import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import middy from '@middy/core'
import httpPartialResponse from '@middy/http-partial-response'
import errorLogger from '@middy/error-logger'

import CartService from 'services/cart.service'
import ProductService from 'services/ProductService'

export async function handleGetCart(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const cartService = new CartService()
  const productService = new ProductService()

  let cart
  try {
    const { Items: products } = await cartService.getById(userId)
    cart = await Promise.all(
      products.map(async product => {
        const productDetail = product?.product
          ? null
          : (await productService.getById(product.productId)).Item

        return !productDetail
          ? product
          : {
              ...product,
              product: productDetail,
            }
      })
    )
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(cart),
  }
}

export const getCart = middy(handleGetCart)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
