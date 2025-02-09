import { ReturnConsumedCapacity } from '@aws-sdk/client-dynamodb'
import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { VendorStatus } from 'entities/VendorEntity'

export default class VendorService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_VENDORS_NAME
  }

  async submitVendor({ userId, data }) {
    const ownerId = userId
    const vendorId = userId

    const createdAt = new Date().toISOString()
    const status = VendorStatus.PENDING

    const vendor = {
      PK: `USER#${ownerId}`,
      SK: `VENDOR#${vendorId}`,
      GSI1PK: `STATUS#${status}`, // get all vendors by status
      GSI1SK: createdAt,
      // name: data.name,
      // slug: data?.slug || null,
      // description: data?.description || null,
      // address: data?.Address || {},
      status,
      isActive: false,
      createdAt,
      vendorId,
      ownerId,
      ...data,
    }

    const params = {
      TableName: this.tableName,
      Item: vendor,
    }

    return this.adapter.create(params)
  }

  async listVendors({ status, limit, nextToken }) {
    let params = {
      TableName: this.tableName,
    }
    if (status) {
      params = {
        ...params,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :status',
        ExpressionAttributeValues: {
          ':status': `STATUS#${status}`,
        },
      }
    }

    if (limit) {
      params.Limit = limit
    }
    if (nextToken) {
      params.ExclusiveStartKey = nextToken
    }

    return params.IndexName
      ? this.adapter.query(params)
      : this.adapter.scan(params)
  }

  async getVendor({ userId, vendorId }) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `VENDOR#${vendorId}`,
      },
    }

    return this.adapter.get(params)
  }

  async queryByIndex({ indexName, field, value }) {
    return this.adapter.queryIndexByField(
      this.tableName,
      indexName,
      field,
      value
    )
  }

  async approveVendor({ userId, vendorId }) {
    const vendor = await this.getVendor({ userId, vendorId })

    if (!vendor) {
      throw new Error('Vendor not found')
    }

    const updatedAt = new Date().toISOString()

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `VENDOR#${vendorId}`,
      },
      UpdateExpression:
        'SET #status = :status, #isActive = :isActive, GSI1PK = :gsi1pk, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#isActive': 'isActive',
      },
      ExpressionAttributeValues: {
        ':status': VendorStatus.APPROVED,
        ':isActive': true,
        ':gsi1pk': `STATUS#${VendorStatus.APPROVED}`,
        ':updatedAt': updatedAt,
      },
      ReturnValues: 'ALL_NEW',
    }

    return this.adapter.update(params)
  }

  async disableVendor({ userId, vendorId }) {
    const vendor = await this.getVendor({ userId, vendorId })

    if (!vendor) {
      throw new Error('Vendor not found')
    }

    const updatedAt = new Date().toISOString()

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `VENDOR#${vendorId}`,
      },
      UpdateExpression:
        'SET #status = :status, #isActive = :isActive, GSI1PK = :gsi1pk, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#isActive': 'isActive',
      },
      ExpressionAttributeValues: {
        ':status': VendorStatus.DISABLE,
        ':isActive': false,
        ':gsi1pk': `STATUS#${VendorStatus.DISABLE}`,
        ':updatedAt': updatedAt,
      },
      ReturnValues: 'ALL_NEW',
    }

    return this.adapter.update(params)
  }
  
  async updateVendor({ userId, vendorId, vendorData }) {
    const vendor = await this.getVendor({ userId, vendorId })

    if (!vendor) {
      throw new Error('Vendor not found')
    }

    const updatedAt = new Date().toISOString()

    let UpdateExpression = 'SET #updatedAt = :updatedAt'
    let ExpressionAttributeNames = {
      '#updatedAt': 'updatedAt',
    }
    let ExpressionAttributeValues = { ':updatedAt': updatedAt }

    Object.keys(vendorData).forEach(key => {
      const value = vendorData[key]

      UpdateExpression += `, #${key} = :${key}`
      ExpressionAttributeNames[`#${key}`] = key
      ExpressionAttributeValues[`:${key}`] = value
    })

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `VENDOR#${vendorId}`,
      },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      // UpdateExpression:
      // 'SET #name = :name, #description = :description, #slug = :slug, updatedAt = :updatedAt',
      // ExpressionAttributeNames: {
      //   '#name': 'name',
      //   '#description': 'description',
      //   '#slug': 'slug',
      // },
      // ExpressionAttributeValues: {
      //   ':name': data.Name,
      //   ':description': data.Description,
      //   ':slug': data.Slug,
      //   ':updatedAt': updatedAt,
      // },
      ReturnValues: 'UPDATED_NEW',
    }

    return this.adapter.update(params)
  }
}
