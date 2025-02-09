import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'

import SettingService from 'services/SettingService'
import { isAdmin } from 'libs/lambda'

export async function handleAdminAddToSetting(event) {
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
    // Decode the base64-encoded body
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    event_body = JSON.parse(decodedBody);
  } else {
    // If the body is not encoded, parse it directly
    event_body = JSON.parse(event.body);
  }

  const service = new SettingService()

  try {
    //TODO: Update vendor Status to APPROVED
    const setting = await service.createSetting(event_body)
    
    return {
      statusCode: 200,
      body: JSON.stringify(setting),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

export const addToSetting = middy(handleAdminAddToSetting)
  .use(httpErrorHandler())
  .use(cors())
  .use(errorLogger())
  .use(httpPartialResponse())
