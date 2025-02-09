import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
// import createHttpError from 'http-errors'
import { Logger } from '@aws-lambda-powertools/logger'
// import { jwtDecode } from 'jwt-decode'

import CognitoAdapter from 'adapters/cognito.adapter'
import AddressService from 'services/AddressService'
// import { verifyUser } from 'services/auth.service'

const logger = new Logger()

export async function getProfile({ username }) {
  let attributes = {}
  try {
    const adapter = new CognitoAdapter({ region: process.env.AWS_REGION })
    const user = await adapter.adminGetUser({
      userPoolId: process.env.USER_POOL_ID,
      userName: username,
    })

    user.UserAttributes.forEach(attr => {
      if (attr.Name !== 'sub') attributes[attr.Name] = attr.Value
    })
  } catch (error) {
    throw error
  }

  return attributes
}

export async function handleGetMe(event) {
  const { claims } = event.requestContext.authorizer

  const { sub: userId } = claims
  const groups = claims['cognito:groups'] || undefined
  const attributes = await getProfile({ username: userId })
  const defaultAddressId = attributes?.address || undefined

  const addressService = new AddressService()

  let addressDetail = undefined
  if (defaultAddressId) {
    addressDetail = await addressService
      .getAddress(userId, defaultAddressId)
      .then(({ Item }) => Item)
      .catch(error => {
        console.error(error.message)
        return undefined
      })
  }

  console.dir({ ...attributes, addressDetail })

  return {
    statusCode: 200,
    body: JSON.stringify({
      username: userId,
      userId,
      groups,
      ...attributes,
      addressDetail: addressDetail || undefined,
    }),
  }
}

export const me = middy(handleGetMe)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
