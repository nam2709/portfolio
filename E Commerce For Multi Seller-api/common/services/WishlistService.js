import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'

export default class WishlistService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_WISHLIST_NAME
  }

  async addToWishlist(userId, productId) {
    const params = {
      TableName: this.tableName,
      Item: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`,
        userId,
        productId,
      },
    }
    return this.adapter.create(params)
  }

  async removeFromWishlist(userId, productId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`,
      },
    }
    return this.adapter.delete(params)
  }

  async listWishlists(userId) {
    return this.adapter.queryByField(this.tableName, 'PK', `USER#${userId}`)
  }
}
