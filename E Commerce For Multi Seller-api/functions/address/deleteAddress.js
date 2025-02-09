import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import AddressService from 'services/AddressService'

export async function handleDeleteAddress(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const addressId = event.pathParameters.id

  const service = new AddressService()

  return service
    .deleteAddress(userId, addressId)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${userId} removed address ${addressId}`,
        userId,
        addressId,
      }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const deleteAddress = middy(handleDeleteAddress)
  .use(httpErrorHandler())
  .use(cors())
