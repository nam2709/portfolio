import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { schemaValidator } from 'libs/lambda'
import ReviewService from 'services/ReviewService'
import { number, object, string } from 'yup'

const schema = {
  body: object({
    productId: string().required(),
    rating: number().positive().integer().max(5).required(),
    comment: string(),
  }).required(),
}

export async function handleAddReview(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const review = event.body
  const { productId } = review
  delete review.productId

  const service = new ReviewService()

  return service
    .addReview(userId, productId, review)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const addReview = middy(handleAddReview)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(schemaValidator(schema))
