import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import createHttpError from 'http-errors'

import WishlistService from 'services/WishlistService'
import ProductService from 'services/ProductService'
import VendorService from 'services/vendor.service'

export async function handleListWishlists(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const wishlistService = new WishlistService()
  const productService = new ProductService()
  const vendorService = new VendorService()

  let products = []
  try {
    const Items = await wishlistService
      .listWishlists(userId)
      .then(res => res.Items)
      .catch(console.error)
    console.log({ Items })
    products = (await Promise.all(
      Items.map(async p => {
        const product = await productService
          .getById(p.productId)
          .then(res => res.Item)
          .catch(console.error)
          if (!product) {
            console.warn(`Product not found for ID: ${p.productId}`);
            return null;
          }
        console.log({ product })
        const vendor = await vendorService
          .getVendor({ userId: product.vendorId, vendorId: product.vendorId })
          .then(res => res.Item)
          .catch(console.error)
          if (!vendor || product?.status !== 'APPROVED') {
            console.warn(`Invalid Product: ${p?.productId} `);
            return null;
          }
        return {
          ...product,
          vendor,
        }
      })
    ));

    // filter cac truong hop null
    const results = products.filter(p => p !== null)
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    }
  } catch (error) {
    throw new createHttpError.InternalServerError(error.message)
  }
}

export const listWishlists = middy(handleListWishlists)
  .use(httpErrorHandler())
  .use(cors())
