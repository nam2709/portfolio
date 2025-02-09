import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import middy from '@middy/core'
import VendorService from 'services/vendor.service'

export async function handleSubmitVendor(event) {
  const { claims } = event.requestContext.authorizer
  const userId = claims.sub
  //TODO: Make sure this user didn't create a vendor before
  const data = event.body

  // console.log({ userId, ...data, table: process.env.TABLE_VENDORS_NAME })

  const service = new VendorService()
  return service
    .submitVendor({ userId, data })
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res),
    }))
    .catch(error => {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      }
    })
}

export const submitVendor = middy(handleSubmitVendor)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors())
//TODO: Add validator

/**
 * Vendor Input
{
    Name
    Slug
    CoverImage { Thumbnail, Original}
    Logo { Thumbnail, Original }
    Description
    Address { Street, Ward, District, City }
    Status (Pending)
    IsActive
    OwnerId
}
 */
