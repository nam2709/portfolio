import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { object, string } from 'yup'

import { schemaValidator } from 'libs/lambda'
import AddressService from 'services/AddressService'

const schema = {
  body: object({
    title: string(),
    street: string().required(),
    city: string().required(),
    district: string().required(),
    ward: string().required(),
    zip: string(),
    country: string(),
  }).required(),
}

export async function handleCreateAddress(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const service = new AddressService()

  return service
    .createAddress(userId, {
      ...event.body,
      country: 'Vietnam',
    })
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Address created' }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const createAddress = middy(handleCreateAddress)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(schemaValidator(schema))
