import { DynamoDBClient, CreateTableCommand, ListTablesCommand, DescribeTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb'
import { config } from 'dotenv';
import path from 'path';

const stage = process.env.STAGE || 'dev';
const envPath = path.resolve(__dirname, `../.env.${stage}`);
config({ path: envPath });

// console.log('DYNAMODB_ENDPOINT', process.env.DYNAMODB_ENDPOINT)

const dynamodb = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
})

async function pollTablesList(tableName) {
  while (true) {
      const tables = await dynamodb.send(new ListTablesCommand());
      if (!tables.TableNames.includes(tableName)) {
          break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1 second
  }
}

async function pollTable(status, tableName) {
  while (true) {
      const table = await dynamodb.send(new DescribeTableCommand({ TableName: tableName }));
      if (table.Table.TableStatus === status) {
          break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1 second
  }
}

export async function setup(tableName) {
  if (tableName && typeof(tableName) === "object") {
    tableName = "counpon-db";
  }
  // console.log("Running Setup Start");
  const input = {
      "AttributeDefinitions": [
          {
          "AttributeName": "PK",
          "AttributeType": "S"
          },
          {
          "AttributeName": "SK",
          "AttributeType": "S"
          }
      ],
      "KeySchema": [
          {
          "AttributeName": "PK",
          "KeyType": "HASH"
          },
          {
          "AttributeName": "SK",
          "KeyType": "RANGE"
          }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 5,
        "WriteCapacityUnits": 5
      },
      "TableName": tableName
  };
  try {
      // console.log(`Creating table: ${tableName}`);
      await dynamodb.send(new CreateTableCommand(input));
      await pollTable("ACTIVE", tableName);
  } catch (e) {
      // console.error("Error in setup:", e);
  }
  // console.log("Running Setup End");
}

export async function teardown(tableName) {
  // console.log("Running Teardown Start");
  try {
      // console.dir(`Deleting table: ${tableName}`);
      const input = {
        TableName: tableName,
      };
      await dynamodb.send(new DeleteTableCommand(input));
      await pollTablesList(tableName);
  } catch (e) {
      // console.error("Error in teardown:", e);
  }
  // console.log("Running Teardown End");
}
