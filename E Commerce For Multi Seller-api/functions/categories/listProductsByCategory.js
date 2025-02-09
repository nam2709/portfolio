import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'
// import { Logger } from '@aws-lambda-powertools/logger'

import CategoryService from 'services/CategoryService'
import ProductService from 'services/ProductService'

// const logger = new Logger()

export async function handleListProductsByCategory(event) {
  const { categoryId } = event.pathParameters
  const service = new CategoryService()
  const productService = new ProductService()

  let products
  try {
    const { Items } = await service.listProductsByCategory(categoryId)
    products = await Promise.all(
      Items.map(async product => {
        const { Item: productDetail } = await productService.getById(
          product.productId
        )

        return {
          ...product,
          ...productDetail,
        }
      })
    )
  } catch (error) {
    throw new createHttpError.InternalServerError(error.message)
  }
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  }
}

export const listProductsByCategory = middy(handleListProductsByCategory)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
