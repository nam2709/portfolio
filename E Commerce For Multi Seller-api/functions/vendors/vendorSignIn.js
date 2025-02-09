import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
import createError from 'http-errors'
import { Logger } from '@aws-lambda-powertools/logger'
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider'
import { jwtDecode } from 'jwt-decode'

import VendorService from 'services/vendor.service'
import errorLogger from '@middy/error-logger'
// import CognitoAdapter from 'adapters/cognito.adapter'

const logger = new Logger()

export async function handleVendorSignIn(event) {
  const { Email, Password } = event.body

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  })

  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: process.env.USER_POOL_CLIENT_ID,
    AuthParameters: {
      USERNAME: Email,
      PASSWORD: Password,
    },
  }

  let user
  try {
    user = await client.send(new InitiateAuthCommand(params))
  } catch (error) {
    console.dir(error, { depth: 4 })
    // throw error
    throw new createError.Unauthorized(error.message) // 401
  }

  const tokens = user.AuthenticationResult
  const { IdToken } = tokens
  const jwt = jwtDecode(IdToken)
  if (!jwt['cognito:groups'] || !jwt['cognito:groups'].includes('Vendor')) {
    throw new createError.Forbidden('User is not a vendor') // 403
  }

  console.dir({ jwt }, { depth: 4 })

  const { sub: userId } = jwt
  const vendorId = userId

  const vendorService = new VendorService()
  const vendor = await vendorService
    .getVendor({ userId, vendorId })
    .then(res => res.Item)
    .catch(console.error)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Sign in successful',
      idToken: tokens.IdToken,
      accessToken: tokens.AccessToken,
      refreshToken: tokens.RefreshToken,
      vendor,
      //   jwt,
    }),
  }
}

export const vendorSignIn = middy(handleVendorSignIn)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
