import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { Logger } from '@aws-lambda-powertools/logger'
import httpPartialResponse from '@middy/http-partial-response'

import CategoryService from 'services/CategoryService'
import errorLogger from '@middy/error-logger'

const logger = new Logger()

export async function handleListCategories(event) {
  logger.info('Start lambda function')
  const service = new CategoryService()
  const { lang } = event.queryStringParameters || {}

  try {
    const result = lang 
      ? await service.listCategories(lang) 
      : await service.listCategories();

    return {
      statusCode: 200,
      body: JSON.stringify(result || []),
    };
  } catch (error) {
    throw new createHttpError.InternalServerError(error.message)
  }
}

export const listCategories = middy(handleListCategories)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
