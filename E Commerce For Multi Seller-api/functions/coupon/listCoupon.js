import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import inputOutputLogger from '@middy/input-output-logger'
// import { Logger } from '@aws-lambda-powertools/logger'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import CouponService from 'services/CouponService'

// const logger = new Logger()

export async function handleListCoupon(event) {

  const service = new CouponService()

  return service
    .listCoupon()
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Items || []),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const listCoupon = middy(handleListCoupon)
  .use(httpErrorHandler())
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
