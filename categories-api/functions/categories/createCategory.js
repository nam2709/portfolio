import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import jsonBodyParser from '@middy/http-json-body-parser'
import createHttpError from 'http-errors'
import { Logger } from '@aws-lambda-powertools/logger'
import { schemaValidator } from 'libs/lambda'
import { object, string } from 'yup'

import CategoryService from 'services/CategoryService'
import errorLogger from '@middy/error-logger'

const logger = new Logger()

const schema = {
  body: object({
    categoryId: string(),
    name: string().required(),
    slug: string(),
    description: string().required(),
    original_url: string(),
  }).required(),
}

export async function handleCreateCategory(event) {
  // const { claims } = event.requestContext.authorizer
  // if (!claims['cognito:groups']?.includes('Admin')) {
  //   throw new createHttpError.Forbidden('User is not an admin')
  // }

  const category = event.body
  const service = new CategoryService()
  return service
    .createCategory(category)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Category created', category: res }),
    }))
    .catch(error => {
      console.error('Error adding book to category:', error);
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          message: error.message || 'Internal Server Error',
        }),
      };
    })
}

export const createCategory = middy(handleCreateCategory)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(jsonBodyParser())
  .use(cors())
  .use(schemaValidator(schema))