import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import middy from '@middy/core'
import ProductService from 'services/ProductService'

export async function handleCreateProduct(event) {
  const { claims } = event.requestContext.authorizer

  if (!claims['cognito:groups'].includes('Vendor')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not a vendor' }),
    }
  }

  // console.log({ claims })
  const userId = claims.sub
  const service = new ProductService()
  const product = { vendorId: userId, ...event.body }

  return service
    .createProduct(userId, product)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const createProduct = middy(handleCreateProduct)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors())
