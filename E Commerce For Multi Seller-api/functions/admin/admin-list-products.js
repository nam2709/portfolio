import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import eventNormalizer from '@middy/event-normalizer'
import httpPartialResponse from '@middy/http-partial-response'
import errorLogger from '@middy/error-logger'

import ProductService from 'services/ProductService'
import { isAdmin } from 'libs/lambda'
import VendorService from 'services/vendor.service'
// import { ProductStatus } from 'entities/ProductEntity'

export async function handleAdminListProducts(event) {
  if (!isAdmin(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not an admin' }),
    }
  }

  const query = event.queryStringParameters
  const status = query?.status
  const limit = query?.limit
  const nextToken = query?.nextToken || null

  // console.log({ status, limit, nextToken })

  const service = new ProductService()
  const vendorService = new VendorService()

  try {
    const products = await service
      .adminListProducts({
        status: status,
        limit: limit,
        nextToken: nextToken,
      })
      .then(res => res.Items)

    const promises = products.map(async product => {
      const store = await vendorService
        .getVendor({ userId: product.vendorId, vendorId: product.vendorId })
        .then(res => res.Item)
        .catch(error => {
          console.error('Error fetching product store: ', error?.message || error)
          return {}
        })

      console.dir({ product_store: store })

      return {
        id: product.id,
        productId: product.productId,
        vendorId: product.vendorId,
        store_id: product.vendorId,
        name: product.name,
        // description: product.description,
        price: product.price,
        sale_price: product?.sale_price || product.price,
        status: product.status,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
        quantity: product.quantity,
        stock_status: product.quantity > 0 ? 'in_stock' : 'out_of_stock',
        store: {
          store_name: store?.name || product.vendorId,
          store_id: store?.vendorId || product.vendorId,
          store_status: store?.status || product.vendorId,
        },
        is_approved: product.status === 'APPROVED' ? 1 : 0,
        product_thumbnail: product?.product_thumbnail,
        // store_logo: product?.store_logo || store_logo,
      }
    })

    const updatedProducts = await Promise.all(promises)

    console.dir({ updatedProducts }, { depth: 3 })

    return {
      statusCode: 200,
      body: JSON.stringify(updatedProducts),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
  // return await service
  //   .adminListProducts({
  //     status: status,
  //     limit: limit,
  //     nextToken: nextToken,
  //   })
  //   .then(res => res.Items)
  //   .then(products => {
  //     const promises = products.map(async product => ({
  //       id: product.id,
  //       productId: product.productId,
  //       name: product.name,
  //       description: product.description,
  //       price: product.price,
  //       sale_price: product?.sale_price || product.price,
  //       status: product.status,
  //       created_at: product.createdAt,
  //       updated_at: product.updatedAt,
  //       store: {
  //         store_name: await vendorService
  //           .getVendor({ userId: product.vendorId, vendorId: product.vendorId })
  //           .then(res => res.Item?.name)
  //           .catch(error => product.vendorId),
  //       },
  //       is_approved: product.status === 'APPROVED' ? 1 : 0,
  //       product_thumbnail: product?.product_thumbnail,
  //       // store_logo: product?.store_logo || store_logo,
  //     }))
  //     return Promise.all(promises)
  //   })
  //   .then(res => ({
  //     statusCode: 200,
  //     body: JSON.stringify(res),
  //   }))
  // .catch(error => ({
  //   statusCode: 500,
  //   body: JSON.stringify({ message: error.message }),
  // }))
}

export const adminListProducts = middy(handleAdminListProducts)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(eventNormalizer())
  .use(httpPartialResponse())
  .use(cors())
