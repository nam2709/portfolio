import middy from '@middy/core'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpErrorHandler from '@middy/http-error-handler'
import httpPartialResponse from '@middy/http-partial-response'

import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'

export async function handleDeleteUserUploadedFiles(event) {
  const userId = event.requestContext.authorizer.claims.sub
  let event_body;

  if (event.isBase64Encoded) {
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    event_body = JSON.parse(decodedBody);
  } else {
    event_body = JSON.parse(event.body);
  }
  const fileId = event_body?.fileId?.imageId || event_body?.fileId

  const adapter = new DynamoDbAdapter()

  const params = {
    TableName: process.env.TABLE_STORAGE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `FILE#${fileId}`,
    },
  }

  console.log('params', params)
  try {
    const files = await adapter.delete(params)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success remove file'
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

export const handler = middy(handleDeleteUserUploadedFiles)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
