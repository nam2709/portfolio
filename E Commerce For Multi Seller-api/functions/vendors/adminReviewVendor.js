import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { adminAddUserToGroup, adminUpdateUserAttributes } from 'services/auth.service'
import VendorService from 'services/vendor.service'

// async function rejectVendorApplication({ userId, vendorId, reason }) {
//   const service = new VendorService()
//   return service.rejectVendor({ userId, vendorId, reason })
// }

// async function approveVendorApplication({ userId, vendorId }) {
//   const service = new VendorService()
//   return service.approveVendor({ userId, vendorId })

export async function handleAdminReviewVendor(event) {
  const { claims } = event.requestContext.authorizer
  if (!~claims['cognito:groups'].indexOf('Admin')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not an admin' }),
    }
  }

  const vendorId = event.pathParameters.id
  const userId = vendorId

  const service = new VendorService()
  try {
    //TODO: Update vendor Status to APPROVED
    const updatedVendor = (
      await service.approveVendor({
        userId,
        vendorId,
      })
    )?.Attributes

    //TODO: AddUserToVendorGroup
    await adminAddUserToGroup({
      username: userId,
      group: 'Vendor',
      UserPoolId: process.env.USER_POOL_ID,
    })

    //TODO: Update user's attribute with vendorId
    await adminUpdateUserAttributes({
      username: userId,
      attributes: {
        'custom:vendorId': vendorId,
      },
      UserPoolId: process.env.USER_POOL_ID,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(updatedVendor),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

export const reviewVendor = middy(handleAdminReviewVendor).use(httpErrorHandler()).use(cors())
