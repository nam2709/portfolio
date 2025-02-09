import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import jsonBodyParser from '@middy/http-json-body-parser'
import createHttpError from 'http-errors'
import { Logger } from '@aws-lambda-powertools/logger'

import CategoryService from 'services/CategoryService'
import errorLogger from '@middy/error-logger'

const logger = new Logger()

export async function handleCreateCategory(event) {
  const { claims } = event.requestContext.authorizer
  if (!claims['cognito:groups']?.includes('Admin')) {
    throw new createHttpError.Forbidden('User is not an admin')
  }

  const category = event.body
  const service = new CategoryService()
  return service
    .createCategory(category)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Category created', category: res }),
    }))
    .catch(error => {
      throw new createHttpError.InternalServerError(error.message)
    })
}

export const createCategory = middy(handleCreateCategory)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(jsonBodyParser())
  .use(cors())
