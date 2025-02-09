import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import OrderService from 'services/OrderService'

export async function handleUpdateOrder(event) {
  const orderId = event.pathParameters.id

  const service = new OrderService()

  return service
    .getOrder(orderId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Items),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const getOrder = middy(handleUpdateOrder)
  .use(httpErrorHandler())
  .use(cors())
