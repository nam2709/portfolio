import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { setup, teardown } from '../../global.setup';
import { DynamoDbAdapter } from 'common/adapters/dynamodb.adapter';

const tableName = `category-test-${Date.now()}`; // Use Date.now() for unique table names
// console.log('tableName', tableName)

beforeAll(async () => {
    await setup(tableName);
});

afterAll(async () => {
    await teardown(tableName);
});

describe('TEST CASE: DYNAMODB ADAPTER LOCAL', () => {
    let db;
    beforeEach(() => {
        db = new DynamoDbAdapter({
            endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
        });
    });

    it('Adapter có thể query by field', async () => {
        // GIVEN
        // WHEN
        const results = await db.queryByField(tableName, 'PK', 'SK');
        // console.log('results', results)
    
        // THEN
        expect(results).toBeTruthy();
        expect(results.Count).toBe(0);
    });
    
    it('Adapter có thể create & delete item', async () => {
        // GIVEN
        const paramsCreate = {
            Item: {
                PK: 'SampleId',
                SK: 'SampleId',
            },
            TableName: tableName
        };
        const paramsDelete = {
            Key: {
                PK: 'SampleId',
                SK: 'SampleId',
            },
            TableName: tableName
        };
    
        // WHEN
        const createResults = await db.create(paramsCreate);
        const queryResults = await db.queryByField(tableName, 'PK', 'SampleId');
        const deleteResults = await db.delete(paramsDelete);
    
        // THEN
        expect(createResults.$metadata.httpStatusCode).toBe(200);
        expect(queryResults.$metadata.httpStatusCode).toBe(200);
        expect(queryResults.Count).toBe(1);
        expect(queryResults.Items[0].PK).toBe('SampleId');
        expect(deleteResults.$metadata.httpStatusCode).toBe(200);
    });
});
