import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import inputOutputLogger from '@middy/input-output-logger'
// import { Logger } from '@aws-lambda-powertools/logger'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import AddressService from 'services/AddressService'

// const logger = new Logger()

export async function handleListAddresses(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const service = new AddressService()

  return service
    .listAddresses(userId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Items || []),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const listAddresses = middy(handleListAddresses)
  .use(httpErrorHandler())
  .use(inputOutputLogger())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
