import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
// import validator from '@middy/validator'
import middy from '@middy/core'
import { object, string } from 'yup'

const schema = object({
  body: object({
    email: string().email().required(),
    password: string().required(),
  }).required(),
})

async function handleSignUp(event) {
  const { Email, Password } = event.body
  // console.log({ event, env: process.env })

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  })

  const params = {
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Username: Email,
    Password: Password,
    UserAttributes: [{ Name: 'email', Value: Email }],
  }

  return client
    .send(new SignUpCommand(params))
    .then(data => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Sign up successful', data }),
    }))

    .catch(error => ({
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const signUp = middy()
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors())
  //  .use(validator({ eventSchema: schema }))
  .handler(handleSignUp)
