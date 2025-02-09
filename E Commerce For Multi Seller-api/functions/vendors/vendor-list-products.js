import httpErrorHandler from '@middy/http-error-handler'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import eventNormalizer from '@middy/event-normalizer'
import httpPartialResponse from '@middy/http-partial-response'

import ProductService from 'services/ProductService'

export async function handleListProducts(event) {
  const { claims } = event.requestContext.authorizer

  if (!claims['cognito:groups'].includes('Vendor')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not a vendor' }),
    }
  }

  const vendorId = claims.sub
  const query = event.queryStringParameters
  const status = query?.status
  const limit = parseInt(query?.limit || '10')
  const nextToken = query?.nextToken || null
  // const { status, limit, nextToken } = event.body

  const service = new ProductService()
  return service
    .vendorListProducts({
      vendorId,
      status: status,
      limit: limit,
      nextToken: nextToken,
    })
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res?.Items || []),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const vendorListProducts = middy(handleListProducts)
  .use(httpErrorHandler())
  .use(eventNormalizer())
  .use(httpPartialResponse())
  .use(cors())
