import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import createHttpError from 'http-errors'
import errorLogger from '@middy/error-logger'
// import { Logger } from '@aws-lambda-powertools/logger'

import CognitoAdapter from 'adapters/cognito.adapter'

// const logger = new Logger()

export async function handleUpdateProfile(event) {
  const username = event.requestContext.authorizer.claims.sub
  const profile = event.body
  //   const accessToken = event.headers.Authorization.split(' ').pop()
  const adapter = new CognitoAdapter({ region: process.env.AWS_REGION })

  let result = undefined
  try {
    result = await adapter.adminUpdateUser({
      userPoolId: process.env.USER_POOL_ID,
      username,
      attributes: profile,
    })
  } catch (error) {
    throw new createHttpError.InternalServerError('Error updating user profile')
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Profile updated',
      ...result,
    }),
  }
}

export const updateProfile = middy(handleUpdateProfile)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(jsonBodyParser())
  .use(cors())
