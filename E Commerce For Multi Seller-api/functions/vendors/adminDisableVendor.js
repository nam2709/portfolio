import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { adminAddUserToGroup, adminUpdateUserAttributes, adminRemoveUserFromGroup } from 'services/auth.service'
import VendorService from 'services/vendor.service'
import ProductService from 'services/ProductService'

// async function rejectVendorApplication({ userId, vendorId, reason }) {
//   const service = new VendorService()
//   return service.rejectVendor({ userId, vendorId, reason })
// }

// async function approveVendorApplication({ userId, vendorId }) {
//   const service = new VendorService()
//   return service.approveVendor({ userId, vendorId })

export async function handleAdminDisableVendor(event) {
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
  const productService = new ProductService()

  try {
    //TODO: Update vendor status to Disabled
    const updatedVendor = (
      await service.disableVendor({
        userId,
        vendorId,
      })
    )?.Attributes;

    //TODO: RemoveUserToVendorGroup
    await adminRemoveUserFromGroup({
      username: userId,
      group: 'Vendor',
      UserPoolId: process.env.USER_POOL_ID,
    })

    //TODO: Update user's attribute with vendorId
    await adminUpdateUserAttributes({
      username: userId,
      attributes: {
        'custom:vendorId': '',
      },
      UserPoolId: process.env.USER_POOL_ID,
    })

    //TODO: List all product IDs for a vendor
    const response = await productService.vendorListProducts({
      vendorId,
    });
    const listProductIds = response?.Items.map(product => product.productId);

    //TODO: Disable all products of the vendor
    const disableAllProducts = async (productIds) => {
      for (const productId of productIds) {
        const updatedProduct = (
          await productService.adminDisableProduct({ vendorId, productId })
        )?.Attributes;

        // Optionally: Handle the result or log status
        console.log(`Disabled productId: ${productId}`, updatedProduct);
      }
    };

    // Disable all products
    if (listProductIds && listProductIds.length > 0) {
      await disableAllProducts(listProductIds);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({vendor: updatedVendor, listProduct: listProductIds}),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

export const disableVendor = middy(handleAdminDisableVendor).use(httpErrorHandler()).use(cors())
