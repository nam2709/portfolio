import cors from '@middy/http-cors'
import {
  CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import middy from '@middy/core'

export async function handleListUsersInGroup(event) {
  const { claims } = event.requestContext.authorizer
  if (!claims['cognito:groups'].includes('Admin')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'User is not an admin' }),
    }
  }

  const { group, limit, nextToken } = event.body
  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  })

  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    GroupName: group,
    Limit: limit,
    NextToken: nextToken,
  }

  return client
    .send(new ListUsersInGroupCommand(params))
    .then(data => ({
      statusCode: 200,
      body: JSON.stringify({ users: data.Users, nextToken: data.NextToken }),
    }))
    .catch(error => ({
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const listUsersInGroup = middy()
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors())
  .handler(handleListUsersInGroup)
