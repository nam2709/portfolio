import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'

export const translationData = async (tableName, PK, SK) => {
    const adapter = new DynamoDbAdapter()
    // Fetch the translation if a language is provided
    const translationParams = {
        TableName: tableName,
        Key: {
          PK: PK,
          SK: SK,
        },
    };

    const translationResult = await adapter.get(translationParams);
    console.log('translationResult', translationResult)

    return translationResult.Item;
}