import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import CategoryService from 'services/CategoryService'

export async function handleDeleteCategory(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const CategoryId = event.pathParameters.categoryId
  const  { type }= event.queryStringParameters

  const service = new CategoryService()

  return service
    .deleteCategory(CategoryId, type)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed Category ${CategoryId}`,
        userId,
        CategoryId,
      }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const deleteCategory = middy(handleDeleteCategory)
  .use(httpErrorHandler())
  .use(cors())
