import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { schemaValidator } from 'libs/lambda'
import AddressService from 'services/AddressService'
import { object, string } from 'yup'

const schema = {
  body: object({
    title: string(),
    street: string(),
    city: string(),
    district: string(),
    ward: string(),
    zip: string(),
    country: string(),
  }).required(),
}

export async function handleUpdateAddress(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const addressId = event.pathParameters.id

  const service = new AddressService()

  return service
    .updateAddress(userId, addressId, event.body)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify({ ...res.Attributes }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const updateAddress = middy(handleUpdateAddress)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(schemaValidator(schema))
