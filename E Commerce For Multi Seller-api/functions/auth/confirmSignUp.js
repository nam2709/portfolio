import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import middy from '@middy/core'

export async function handleConfirmSignUp(event) {
  const { Email, Code } = event.body

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  })

  const params = {
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Username: Email,
    ConfirmationCode: Code,
  }

  return client
    .send(new ConfirmSignUpCommand(params))
    .then(data => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Confirmation successful', data }),
    }))
    .catch(error => ({
      statusCode: 400,
      body: JSON.stringify({ message: error.message, event }),
    }))
}

export const confirmSignUp = middy()
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors())
  .handler(handleConfirmSignUp)
