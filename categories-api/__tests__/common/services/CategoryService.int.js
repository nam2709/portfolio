import CategoryService from 'common/services/CategoryService';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { setup, teardown } from '../../global.setup';
import { DynamoDbAdapter } from 'common/adapters/dynamodb.adapter';

const tableName = `category-test-${Date.now()}`; // Use Date.now() for unique table names
// console.log('tableName', tableName)

const adapter = new DynamoDbAdapter({
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
});

beforeAll(async () => {
    await setup(tableName);
});

afterAll(async () => {
    await teardown(tableName);
});

describe('TEST CASE: CATEGORY SERVICE - DYNAMODB LOCAL', () => {
    let CategoryId
    it('Thêm mới Category', async () => {
        // GIVEN
        const service = new CategoryService(adapter, tableName);
        const Category = {
            "name": "Summer",
            "slug": "Summer",
            "description": "Summer",
            "original_url": "image.png"
        }

        // WHEN
        const response = await service.createCategory(Category);
        CategoryId = response.categoryId

        // THEN
        expect(response.name).toBe('Summer');
    });

    it('Thêm mới Category Con', async () => {
        // GIVEN
        const service = new CategoryService(adapter, tableName);
        const Category = {
            "categoryId": CategoryId,
            "name": "Summer Suit",
            "slug": "Summer",
            "description": "Summer",
            "original_url": "image.png"
        }

        // WHEN
        const response = await service.createCategory(Category);
        CategoryId = response.categoryId
        // console.log('response', response)

        // THEN
        expect(response.name).toBe('Summer Suit');
    });
});
