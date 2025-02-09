import {
  DynamoDBDocument,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  BatchWriteCommand,
  BatchGetCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger()

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `undefined`.
  convertEmptyValues: true, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
}

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
}

export class DynamoDbAdapter {
  constructor(options = {}) {
    this.documentClient = new DynamoDBClient({ region: process.env.AWS_REGION, endpoint: options.endpoint || undefined, ...options })

    this.client = DynamoDBDocument.from(this.documentClient, {
      marshallOptions,
      unmarshallOptions,
    })
  }

  async queryByField(TableName, field, value) {
    const parameters = {
      TableName,
      // IndexName: indexName,
      KeyConditionExpression: '#field = :value',
      ExpressionAttributeNames: {
        '#field': field,
      },
      ExpressionAttributeValues: {
        ':value': value,
      },
    }

    return this.client.send(new QueryCommand(parameters))
  }

  async queryIndexByField(TableName, IndexName, field, value) {
    const parameters = {
      TableName,
      IndexName,
      KeyConditionExpression: '#field = :value',
      ExpressionAttributeNames: {
        '#field': field,
      },
      ExpressionAttributeValues: {
        ':value': value,
      },
    }

    return this.client.send(new QueryCommand(parameters))
  }

  async query(parameters) {
    return this.client.send(new QueryCommand(parameters))
  }

  async get(parameters) {
    return this.client.send(new GetCommand(parameters))
  }

  async scan(parameters) {
    return this.client.send(new ScanCommand(parameters))
  }

  async create(parameters) {
    return this.client.send(new PutCommand(parameters))
  }

  async delete(parameters) {
    // console.log(
    //   `Deleting item with PK = ${parameters.Key.PK} & SK = ${
    //     parameters.Key.SK ? parameters.Key.SK : 'not present'
    //   }`
    // )
    return this.client.send(new DeleteCommand(parameters))
  }

  async update(parameters) {
    return this.client.send(new UpdateCommand(parameters))
  }

  async batchWrite(parameters) {
    return this.client.send(new BatchWriteCommand(parameters))
  }

  async batchGet(parameters) {
    return this.client.send(new BatchGetCommand(parameters))
  }

  async transactWrite(parameters) {
    const command = new TransactWriteItemsCommand(parameters);
    
    try {
      const response = await this.client.send(command);
      return response;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }  

  async createItem(tableName, entity) {
    console.log(`Saving new item PK="${entity.PK}" into DynamoDB table ${tableName}`)
    const parameters = {
      Item: entity.toItem(),
      ReturnConsumedCapacity: 'TOTAL',
      TableName: tableName,
    }
    try {
      await this.create(parameters)
      console.log('Item saved successfully')
      return entity
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }
}

// Thanks Alex DeBrie and his DynamoDB Book for this code below
// Alex: Thanks, Paul Swail! https://github.com/aws/aws-sdk-js/issues/2464#issuecomment-503524701
// const executeTransactWrite = async ({ client, parameters }) => {
//   const transactionRequest = client.transactWriteItems(parameters)
//   let cancellationReasons
//   transactionRequest.on('extractError', response => {
//     try {
//       cancellationReasons = JSON.parse(response.httpResponse.body.toString()).CancellationReasons
//     } catch (err) {
//       // suppress this just in case some types of errors aren't JSON parseable
//       console.error('Error extracting cancellation error', err)
//     }
//   })
//   return new Promise((resolve, reject) => {
//     transactionRequest.send((err, response) => {
//       if (err) {
//         err.cancellationReasons = cancellationReasons
//         return reject(err)
//       }
//       return resolve(response)
//     })
//   })
// }
