import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { object, string } from 'yup'

import { schemaValidator } from 'libs/lambda'
import CouponService from 'services/CouponService'

const schema = {
  body: object().required(),
}

export async function handleCreateCoupon(event) {

  const service = new CouponService()

  return service
    .createCoupon({
      ...event.body,
      country: 'Vietnam',
    })
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Coupon created' }),
    }))
    .catch(error => ({
      statusCode: 501,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const createCoupon = middy(handleCreateCoupon)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(schemaValidator(schema))
