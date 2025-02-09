import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import OrderService from 'services/OrderService'

export async function handleListOrders(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const service = new OrderService()

  return service
    .listOrders(userId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res?.Items || []),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const listOrders = middy(handleListOrders)
  .use(httpErrorHandler())
  .use(cors())
