import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { flexId } from 'adapters/flexid.adapter'

export default class AddressService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_ADDRESS_NAME
  }

  async listAddresses(userId) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'ADDRESS#',
      },
    }

    return this.adapter.query(params)
  }

  async createAddress(userId, address) {
    const addressId = flexId()
    const createdAt = new Date().toISOString()

    const params = {
      TableName: this.tableName,
      Item: {
        PK: `USER#${userId}`,
        SK: `ADDRESS#${addressId}`,
        EntityType: 'ADDRESS',
        userId,
        addressId,
        ...address,
        createdAt,
      },
    }

    return this.adapter.create(params)
  }

  async getAddress(userId, addressId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `ADDRESS#${addressId}`,
      },
    }

    return this.adapter.get(params)
  }

  async updateAddress(userId, addressId, address) {
    let UpdateExpression = ''
    let ExpressionAttributeValues = {}
    let ExpressionAttributeNames = {}

    for (const key in address) {
      UpdateExpression +=
        (UpdateExpression.length > 0 ? ', ' : '') + ` #${key} = :${key}`
      ExpressionAttributeValues[`:${key}`] = address[key]
      ExpressionAttributeNames[`#${key}`] = key
    }

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `ADDRESS#${addressId}`,
      },
      UpdateExpression: `SET ${UpdateExpression}`,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }

    return this.adapter.update(params)
  }

  async deleteAddress(userId, addressId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `ADDRESS#${addressId}`,
      },
    }

    return this.adapter.delete(params)
  }

  async updateDefaultAddress(userId, addressId) {
    const addresses = await this.listAddresses(userId)
    const defaultAddress = addresses.Items.find(
      address => address.default === true
    )
    if (defaultAddress) {
      await this.updateAddress(userId, defaultAddress.addressId, {
        ...defaultAddress,
        default: false,
      })
    }
    return this.updateAddress(userId, addressId, {
      ...addresses.Items.find(address => address.addressId === addressId),
      default: true,
    })
  }
}
