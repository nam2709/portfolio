import middy from '@middy/core'
import eventNormalizer from '@middy/event-normalizer'

async function updateOrder(orderId, userId, status, products) {}

/**
 *
 * @param {} event
 *
 * handle events:
 * ecommerce.delivery
 * - DeliveryCompleted
 * - DeliveryFailed
 * ecommerce.warehouse
 * - PackageCreated
 * - PackagingFailed
 */
export async function handleOnEvents(event) {
  for (const record of event.Resources) {
    const { eventName, dynamodb } = record
    const { NewImage, OldImage } = dynamodb
  }
}

export const onEvents = middy(handleOnEvents).use(eventNormalizer())
