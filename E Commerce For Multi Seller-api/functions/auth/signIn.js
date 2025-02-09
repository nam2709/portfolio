import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import middy from '@middy/core'

export async function handleSignIn(event) {
  const { Email, Password } = event.body
  // console.log({ env: process.env })

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

  return client
    .send(new InitiateAuthCommand(params))
    .then(response => ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sign in successful',
        idToken: response.AuthenticationResult.IdToken,
        accessToken: response.AuthenticationResult.AccessToken,
      }),
    }))
    .catch(error => ({
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const signIn = middy()
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors())
  .handler(handleSignIn)
