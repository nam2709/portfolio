import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
// import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpPartialResponse from '@middy/http-partial-response'

import VendorService from 'services/vendor.service'
import { VendorStatus } from 'entities/VendorEntity'

export async function handleListVendors(event) {
  // const { body } = event
  const query = event.queryStringParameters
  const status = query?.status || VendorStatus.PENDING
  const limit = parseInt(query?.limit || '10')
  const nextToken = query?.nextToken || null

  // console.log({ status, limit, nextToken })

  const service = new VendorService()
  return service
    .listVendors({
      status: status,
      limit: limit,
      nextToken: nextToken,
    })
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res?.Items || []),
    }))
    .catch(error => {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      }
    })
}

export const listVendors = middy(handleListVendors)
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpPartialResponse())
  .use(cors())
