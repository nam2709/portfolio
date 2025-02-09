import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { schemaValidator } from 'libs/lambda'
import CouponService from 'services/CouponService'
import { object, string } from 'yup'

const schema = {
  body: object().required(),
}

export async function handleUpdateCoupon(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const CouponId = event.pathParameters.id

  const service = new CouponService()

  return service
    .updateCoupon(CouponId, event.body)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify({ ...res.Attributes }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const updateCoupon = middy(handleUpdateCoupon)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(schemaValidator(schema))
