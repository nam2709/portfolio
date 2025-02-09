import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import httpEventNormalizer from '@middy/http-event-normalizer'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import VendorService from 'services/vendor.service'

const store_logo = {
  id: 1452,
  collection_name: 'attachment',
  name: '04',
  file_name: '04.png',
  mime_type: 'image/png',
  disk: 'public',
  conversions_disk: 'public',
  size: '13034',
  created_by_id: '1',
  created_at: '2023-09-22T08:52:17.000000Z',
  updated_at: '2023-09-22T08:52:17.000000Z',
  original_url: '/assets/images/data/product.png',
}

export async function handleAdminListVendors(event) {
  const query = event.queryStringParameters
  const status = query?.status
  const limit = query?.limit
  const nextToken = query?.nextToken || null

  const service = new VendorService()
  return await service
    .listVendors({
      status: status,
      limit: limit,
      nextToken: nextToken,
    })
    .then(res => res.Items)
    .then(vendors =>
      vendors.map(vendor => ({
        id: vendor.id,
        vendorId: vendor.vendorId,
        store_name: vendor.name,
        name: vendor.name,
        email: vendor.email,
        address: vendor.address,
        status: vendor.status,
        created_at: vendor.createdAt,
        createdAt: vendor.createdAt,
        updated_at: vendor.updatedAt,
        updatedAt: vendor.updatedAt,
        vendor: { name: vendor.name },
        is_approved: vendor.status === 'APPROVED' ? 1 : 0,
        store_logo: vendor?.store_logo || store_logo,
      }))
    )
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

export const adminListVendors = middy(handleAdminListVendors)
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
