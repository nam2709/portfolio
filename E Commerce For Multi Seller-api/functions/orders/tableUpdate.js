import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import eventNormalizer from '@middy/event-normalizer'

/**
 * On table Orders streams, update the table Orders with the new status of the order
 *
 * putEvents: OrderCreated, OrderModified, OrderDeleted
 */
export async function handleTableUpdate(event) {
  const { Records } = event
  for (const record of event.Records) {
    const { eventName, dynamodb } = record
    const { NewImage, OldImage } = dynamodb
  }
}

export const tableUpdate = middy(handleTableUpdate)
  .use(httpErrorHandler())
  //   .use(jsonBodyParser())
  .use(eventNormalizer())
//   .use(schemaValidator(schema))
