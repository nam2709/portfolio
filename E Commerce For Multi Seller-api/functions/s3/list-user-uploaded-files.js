import middy from '@middy/core'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpErrorHandler from '@middy/http-error-handler'
import httpPartialResponse from '@middy/http-partial-response'

import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'

export async function handleListUserUploadedFiles(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const adapter = new DynamoDbAdapter()

  const params = {
    TableName: process.env.TABLE_STORAGE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': 'FILE#',
    },
  }

  try {
    const files = await adapter.query(params)
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: files.Items || [],
        total: files.Count || 0,
      }),
    }
  } catch (error) {
    console.error({ error_list_files: error.message })
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    }
  }
}

export const handler = middy(handleListUserUploadedFiles)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
