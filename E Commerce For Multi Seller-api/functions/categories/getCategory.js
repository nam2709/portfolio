import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { Logger } from '@aws-lambda-powertools/logger'
import httpPartialResponse from '@middy/http-partial-response'

import CategoryService from 'services/CategoryService'
import errorLogger from '@middy/error-logger'

const logger = new Logger()

export async function handleGetCategory(event) {
  logger.info('Start lambda function')
  const service = new CategoryService()
  const { categoryId } = event.pathParameters
  const { lang } = event.queryStringParameters || {}

  try {
    const result = lang
      ? await service.getCategory(categoryId, lang) 
      : await service.getCategory(categoryId);

    return {
      statusCode: 200,
      body: JSON.stringify(result || []),
    };
  } catch (error) {
    throw new createHttpError.InternalServerError(error.message)
  }
}

export const getCategory = middy(handleGetCategory)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
