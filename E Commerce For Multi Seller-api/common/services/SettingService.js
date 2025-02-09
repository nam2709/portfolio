import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'

export default class SettiingService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_SETTING_NAME
  }

  async createSetting(setting) {
    const newSetting = {
      PK: `SETTING#${setting?.action}`,
      SK: `${setting?.language}`,
      language: `${setting?.language}`,
      EntityType: 'Setting',
      ...setting,
    }

    const params = {
      TableName: this.tableName,
      Item: newSetting,
    }

    return this.adapter.create(params)
  }

  async getSetting(setting) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `SETTING#${setting?.action}`,
        SK: `${setting?.language}`,
      },
    }

    return this.adapter.get(params)
  }
}
