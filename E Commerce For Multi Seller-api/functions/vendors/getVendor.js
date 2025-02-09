import httpErrorHandler from '@middy/http-error-handler'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import errorLogger from '@middy/error-logger'

import VendorService from 'services/vendor.service'

export async function handleGetVendor(event) {
  const vendorId = event.pathParameters.id
  const userId = vendorId

  const service = new VendorService()

  return service
    .getVendor({ userId, vendorId })
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Item),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message, userId, vendorId }),
    }))
}

export const getVendor = middy(handleGetVendor)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(httpPartialResponse())
  .use(cors())
