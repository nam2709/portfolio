import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import httpEventNormalizer from '@middy/http-event-normalizer'
import { Logger } from '@aws-lambda-powertools/logger'
import errorLogger from '@middy/error-logger'
import VendorService from 'services/vendor.service'

const logger = new Logger()

export async function handleVendorUpdateProfile(event) {
  const { claims } = event.requestContext.authorizer

  if (
    !claims ||
    !claims.hasOwnProperty('cognito:groups') ||
    !claims['cognito:groups'].includes('Vendor')
  ) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not a vendor' }),
    }
  }

  const vendorService = new VendorService()
  const userId = claims.sub
  const vendorId = claims.sub

  return await vendorService
    .updateVendor({
      userId,
      vendorId,
      vendorData: event.body,
    })
    .then(res => {
      return {
        statusCode: 200,
        body: JSON.stringify(res.Attributes),
      }
    })
    .catch(error => {
      return { statusCode: 500, body: JSON.stringify(error.message) }
    })
}

export const vendorUpdateProfile = middy(handleVendorUpdateProfile)
  .use(jsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
//   .handler(handleVendorUpdateProfile)
