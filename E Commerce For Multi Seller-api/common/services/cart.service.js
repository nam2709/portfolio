import { ReturnValue } from '@aws-sdk/client-dynamodb'
import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { EventBridgeAdapter } from 'adapters/eventbridge.adapter'

export default class CartService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.adapterEvent = new EventBridgeAdapter()
    this.tableName = process.env.TABLE_CARTS_NAME
  }

  async addToCart({ userId, productId, vendorId, quantity, price, product }) {
    const existingItem = await this.getCartItem(userId, productId)

    if (existingItem?.Item) {
      const updatedQuantity =
        parseInt(existingItem.Item.quantity || 0) + parseInt(quantity)
      return this.updateCartItem(userId, productId, updatedQuantity)
    } else {
      const params = {
        TableName: this.tableName,
        Item: {
          PK: `USER#${userId}`,
          SK: `PRODUCT#${productId}`,
          userId,
          productId,
          quantity: parseInt(quantity),
          price: parseInt(price),
          product,
          vendorId,
        },
      }
      return this.adapter.create(params)
    }
  }

  async getById(userId) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
      },
      ConsistentRead: true,
    }

    return this.adapter.query(params)
  }

  async getCart(userId) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
      },
      ConsistentRead: true,
    }

    return this.adapter.query(params)
    // const { Items } = await this.getById(userId)
    // return Items
  }

  async clearCart(userId, products) {
    console.log({ message: 'CLEAR CART', userId, products })
    const deleteRequests = products.map(product => ({
      DeleteRequest: {
        Key: {
          PK: `USER#${userId}`,
          SK: `PRODUCT#${product.productId}`,
        },
      },
    }))

    const params = {
      RequestItems: {
        [this.tableName]: deleteRequests,
      },
    }

    console.log(JSON.stringify(params, null, 2))

    return this.adapter.batchWrite(params)
  }

  async getCartItem(userId, productId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`,
      },
    }

    return this.adapter.get(params)
  }

  async updateCartItem(userId, productId, quantity) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`,
      },
      UpdateExpression: 'SET #quantity = :quantity, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#quantity': 'quantity',
      },
      ExpressionAttributeValues: {
        ':quantity': parseInt(quantity),
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: ReturnValue.ALL_NEW,
    }

    return this.adapter.update(params)
  }

  async removeItemFromCart(userId, productId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`,
      },
    }

    return this.adapter.delete(params)
  }

  async onPaymentEvent(values) {
    console.log('values', values)
    const detail = JSON.stringify(values)
    const input = {
        Entries: [
          {
            Source: "your.payment.system",
            DetailType: "PaymentProcessed",
            Detail: detail,
            EventBusName: `kamarket-${process.env.STAGE}-events`,
          },
        ],
    };
    console.log('input', input)
    return await this.adapterEvent.putEvents(input)
  }
}
