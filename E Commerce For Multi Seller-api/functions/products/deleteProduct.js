import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import ProductService from 'services/ProductService'
import { isAdmin, isVendor } from 'libs/lambda'

export async function handleDeleteProduct(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const ProductId = event.pathParameters.id

  const service = new ProductService()

  if(isAdmin(event) || isVendor(event)){
    return service
    .deleteProduct(ProductId)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed Product ${ProductId}`,
        ProductId,
      }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
  } else {
    return {
      statusCode: 501,
      body: JSON.stringify({ message: 'User dont have authorize to delete Product' }),
    }
  }
}

export const deleteProduct = middy(handleDeleteProduct)
  .use(httpErrorHandler())
  .use(cors())
