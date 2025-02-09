import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import OrderService from 'services/OrderService'
import eventNormalizer from '@middy/event-normalizer'
import httpPartialResponse from '@middy/http-partial-response'

export async function handleUserListOrders(event) {
  const { claims } = event.requestContext.authorizer
  const userId = claims.sub

  const service = new OrderService()
  const query = event.queryStringParameters
  console.log('query', query)
  // Properly structure if-else statement
  if (query?.product_id) {
    return service
      .getProductsByUser(userId, query.product_id)
      .then(res => ({
        statusCode: 200,
        body: JSON.stringify(res.Items || []),
      }))
      .catch(error => ({
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      }));
  } else {
  return service
    .listOrdersByUser({ userId, query })
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Items || []),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
  }
}

export const userListOrders = middy(handleUserListOrders)
  .use(httpErrorHandler())
  .use(eventNormalizer())
  .use(httpPartialResponse())
  .use(cors())
