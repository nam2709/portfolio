// import { BaseSchema } from 'yup'

export const schemaValidator = schema => {
  const before = async request => {
    try {
      const { body, queryStringParameters } = request.event

      if (schema.body) {
        schema.body.validateSync(body)
      }

      if (schema.queryStringParameters) {
        schema.queryStringParameters.validateSync(queryStringParameters ?? {})
      }

      return Promise.resolve()
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: e.errors,
        }),
      }
    }
  }

  return {
    before,
  }
}

export const isAdmin = event => {
  const claims = event?.requestContext?.authorizer.claims

  return claims?.['cognito:groups']?.includes('Admin')
}

export const isVendor = event => {
  const claims = event?.requestContext?.authorizer.claims

  return claims?.['cognito:groups']?.includes('Vendor')
}
