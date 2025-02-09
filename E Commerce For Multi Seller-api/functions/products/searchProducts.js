import middy from '@middy/core'
import eventNormalizer from '@middy/event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import httpPartialResponse from '@middy/http-partial-response'
// import inputOutputLogger from '@middy/input-output-logger'
import errorLogger from '@middy/error-logger'
import httpEventNormalizer from '@middy/http-event-normalizer'

import ProductService from 'services/ProductService'

export async function handleSearchProducts(event) {
  const query = event.queryStringParameters
  console.dir({ query }, { depth: 5 })
  const { ids } = query

  const service = new ProductService()

  if (ids) {
    return service
      .batchGetProducts(ids.split(','))
      .then(res => ({
        statusCode: 200,
        body: JSON.stringify(res || []),
      }))
      .catch(error => {
        console.log('Error', error)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: error.message }),
        }
      })
  }

  return service
    .searchProducts(query)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res?.Items || []),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const searchProducts = middy(handleSearchProducts)
  .use(httpErrorHandler())
  .use(eventNormalizer())
  .use(httpEventNormalizer())
  .use(httpPartialResponse())
  // .use(inputOutputLogger())
  .use(errorLogger())
  .use(cors())
