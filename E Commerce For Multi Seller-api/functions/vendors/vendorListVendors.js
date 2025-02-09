import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
// import jsonBodyParser from '@middy/http-json-body-parser'
import middy from '@middy/core'
// import validator from '@middy/validator'
// import { transpileSchema } from '@middy/validator/transpile'
import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
// import VendorService from 'services/vendor.service'

// const eventSchema = transpileSchema({})

export async function handleListVendors(event) {
  //   const { claims } = event.requestContext.authorizer

  // const service = new VendorService()
  const adapter = new DynamoDbAdapter()

  const tableName = process.env.TABLE_VENDORS_NAME
  const indexName = 'GSI1'
  const field = 'GSI1PK'
  const value = 'STATUS#PENDING'
  return adapter
    .queryIndexByField(tableName, indexName, field, value)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res.Items),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))

  // return service
  //   .queryByIndex({
  //     indexName: 'GSI1',
  //     field: 'GSI1PK',
  //     value: 'STATUS#PENDING',
  //   })
  //   .then(res => ({
  //     statusCode: 200,
  //     body: JSON.stringify(res.Items),
  //   }))
  //   .catch(error => ({
  //     statusCode: 500,
  //     body: JSON.stringify({ message: error.message }),
  //   }))
}

export const listVendors = middy(handleListVendors)
  //.use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors())
//.use(validator({ eventSchema }))
