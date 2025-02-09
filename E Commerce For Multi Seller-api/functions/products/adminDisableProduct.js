import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { adminAddUserToGroup, adminUpdateUserAttributes } from 'services/auth.service'
import ProductService from 'services/ProductService'
import jsonBodyParser from '@middy/http-json-body-parser'

// async function rejectVendorApplication({ userId, vendorId, reason }) {
//   const service = new VendorService()
//   return service.rejectVendor({ userId, vendorId, reason })
// }

// async function approveVendorApplication({ userId, vendorId }) {
//   const service = new VendorService()
//   return service.approveVendor({ userId, vendorId })

export async function handleAdminDisableProduct(event) {
  const { claims } = event.requestContext.authorizer

  if (!claims['cognito:groups'].includes('Admin')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not an admin' }),
    }
  }

  const { vendorId, productId } = event.body

  const service = new ProductService()
  try {
    //TODO: Update vendor Status to Disable
    const updatedProduct = (
      await service.adminDisableProduct({
        vendorId,
        productId,
      })
    )?.Attributes

    return {
      statusCode: 200,
      body: JSON.stringify(updatedProduct),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

export const disableProduct = middy(handleAdminDisableProduct)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
