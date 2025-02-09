import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { schemaValidator } from 'libs/lambda'
import CategoryService from 'services/CategoryService'
import { object, string } from 'yup'

const schema = {
  body: object().required(),
}

export async function handleUpdateCategory(event) {
  const CategoryId = event.pathParameters.categoryId

  const service = new CategoryService()

  return service
    .updateCategory(CategoryId, event.body)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify({ ...res.Attributes }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const updateCategory = middy(handleUpdateCategory)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())
  .use(schemaValidator(schema))
