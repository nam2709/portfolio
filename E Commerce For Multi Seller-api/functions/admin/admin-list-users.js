import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import CognitoAdapter from 'adapters/cognito.adapter'
import { isAdmin } from 'libs/lambda'

export async function handleAdminListUsers(event) {
  if (!isAdmin(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'You are not authorized to access this resource',
      }),
    }
  }

  const adapter = new CognitoAdapter({ region: process.env.AWS_REGION })
  const users = await adapter.listUsers({
    userPoolId: process.env.USER_POOL_ID,
  })
  return {
    statusCode: 200,
    body: JSON.stringify({ data: users.Users }),
  }
}

export const adminListUsers = middy(handleAdminListUsers)
  .use(httpErrorHandler())
  .use(cors())
  .use(errorLogger())
  .use(httpPartialResponse())
