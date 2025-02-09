import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import ReviewService from 'services/ReviewService'

export async function handleListReviews(event) {
  //   const userId = event.requestContext.authorizer.claims.sub
  const productId = event.pathParameters.id

  const service = new ReviewService()

  return service
    .listReviews(productId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Items || []),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const listReviews = middy(handleListReviews)
  .use(httpErrorHandler())
  .use(cors())
