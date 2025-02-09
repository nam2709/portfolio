import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import UserService from 'services/UserService'
import { isAdmin } from 'libs/lambda'

export async function handleAdminUsers(event) {
  if (!isAdmin(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'You are not authorized to access this resource',
      }),
    }
  }

  let event_body;

  if (event.isBase64Encoded) {
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    event_body = JSON.parse(decodedBody);
  } else {
    event_body = JSON.parse(event.body);
  }

  const action = event_body?.action
  const username = event_body?.username
  const services = new UserService()
  const users = await services.handleAdminUser({
    action: action,
    username: username
  })
  return {
    statusCode: 200,
    body: JSON.stringify({ data: users }),
  }
}

export const adminUser = middy(handleAdminUsers)
  .use(httpErrorHandler())
  .use(cors())
  .use(errorLogger())
  .use(httpPartialResponse())
