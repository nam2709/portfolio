import httpErrorHandler from '@middy/http-error-handler'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'

import SettingService from 'services/SettingService'
import errorLogger from '@middy/error-logger'
import { isAdmin } from 'libs/lambda'

export async function handleGetSetting(event) {
  
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
    const setting = await service.getSetting(event_body)
    
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

export const getSetting = middy(handleGetSetting)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
