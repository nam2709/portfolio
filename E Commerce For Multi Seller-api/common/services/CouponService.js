import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { flexId } from 'adapters/flexid.adapter'

export default class CouponService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_COUPON_NAME
  }

  async listCoupon() {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `COUPON`,
        ':sk': 'COUPON#',
      },
    }

    return this.adapter.query(params)
  }

  async createCoupon(Coupon) {
    const CouponId = flexId()
    const createdAt = new Date().toISOString()

    const params = {
      TableName: this.tableName,
      Item: {
        PK: `COUPON`,
        SK: `COUPON#${CouponId}`,
        EntityType: 'Coupon',
        CouponId,
        ...Coupon,
        createdAt,
      },
    }

    return this.adapter.create(params)
  }

  async updateCoupon(CouponId, Coupon) {
    let UpdateExpression = ''
    let ExpressionAttributeValues = {}
    let ExpressionAttributeNames = {}

    for (const key in Coupon) {
      UpdateExpression +=
        (UpdateExpression.length > 0 ? ', ' : '') + ` #${key} = :${key}`
      ExpressionAttributeValues[`:${key}`] = Coupon[key]
      ExpressionAttributeNames[`#${key}`] = key
    }

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `COUPON`,
        SK: `COUPON#${CouponId}`,
      },
      UpdateExpression: `SET ${UpdateExpression}`,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }

    return this.adapter.update(params)
  }

  async deleteCoupon(CouponId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `COUPON`,
        SK: `COUPON#${CouponId}`,
      },
    }

    return this.adapter.delete(params)
  }
}
