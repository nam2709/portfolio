import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { flexId } from 'adapters/flexid.adapter'

export default class ReviewService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_REVIEW_NAME
  }

  async addReview(userId, productId, review) {
    const reviewId = flexId()
    const createdAt = new Date().toISOString()

    const params = {
      TableName: this.tableName,
      Item: {
        PK: `PRODUCT#${productId}`,
        SK: `USER#${userId}`,
        EntityType: 'REVIEW',
        userId,
        productId,
        reviewId,
        ...review,
        createdAt,
      },
    }

    return this.adapter.create(params)
  }

  async listReviews(productId) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `PRODUCT#${productId}`,
      },
    }

    return this.adapter.query(params)
  }
}
