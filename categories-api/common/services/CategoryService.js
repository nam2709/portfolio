import { v4 } from 'uuid'

import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { translationData } from '../../libs/translation'
import { marshall } from '@aws-sdk/util-dynamodb';

// import { flexId } from 'adapters/flexid.adapter'
// import ProductService from './ProductService'

export default class CategoryService {
  constructor(adapter, tableName) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = tableName || process.env.TABLE_CATEGORIES_NAME
  }

  async getCategory(categoryId, lang) {
    // console.log('categoryIdcategoryId', categoryId)
    // Ensure the categoryId is valid and not null
    if (!categoryId) {
      throw new Error('categoryId must not be null or undefined.');
    }

    // Initialize category object
    let category = {
      ':PK' : '',
      ':SK': '',
    };

    // Find the last index of '#SUB' if it exists
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const lastIndex = SubcategoryId.lastIndexOf('#SUB');

    if (lastIndex !== -1) {
        // '#SUB' is found, split at the last occurrence
        category[':PK'] = `CATEGORY#${SubcategoryId.substring(0, lastIndex)}`; // Grab everything before the last '#SUB'
        category[':SK'] = `CATEGORY#${SubcategoryId}`;
    } else {
        // '#SUB' is not found, use default structure
        category[':PK'] = 'CATEGORY';
        category[':SK'] = `CATEGORY#${categoryId}`;
    }
    // console.log('category', category)

    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK and SK = :SK',
      ExpressionAttributeValues: category,
    }

    if (!lang) {
      const originalCategory = await this.adapter.query(params)
      return originalCategory.Items[0]
    }

    const originalCategory = await this.adapter.query(params)
    const translatedCategory = await translationData(this.tableName, `CATEGORY#${SubcategoryId}`, `CATEGORY#${SubcategoryId}#LANG${lang}`);

    if (translatedCategory) {
      return {
        ...originalCategory.Items[0],
        translations: translatedCategory
      };
    } else {
      return originalCategory.Items[0]
    }
  }

  async createCategory(data) {
    const createdAt = new Date().toISOString()
    const categoryId = data?.categoryId;
    // console.log('categoryIds', categoryId)

    // Check if the parent category exists
    if (categoryId) {
      const parentCategory = await this.getCategory(categoryId);
      if (!parentCategory) {
        throw new Error(`Parent category with ID ${categoryId} does not exist.`);
      }
    }

    const categoryIdNew = v4();
    const category = {
      PK: categoryId ? `CATEGORY#${categoryId}` : "CATEGORY",
      SK: categoryId ? `CATEGORY#${categoryId}#SUB${categoryIdNew}` : `CATEGORY#${categoryIdNew}`,
      categoryId: categoryId ? `${categoryId}#SUB${categoryIdNew}` : categoryIdNew,
      lang: data?.lang || undefined,
      name: data?.name || undefined,
      description: data?.description || undefined,
      slug: data?.slug || undefined,
      original_url: data?.original_url || undefined,
      isActive: true,
      createdAt,
    };

    const params = {
      TableName: this.tableName,
      Item: category,
    }

    return this.adapter.create(params).then(() => category)
  }

  async updateCategory(categoryId, category) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const categoryDetail = await this.getCategory(SubcategoryId);
    console.log('categoryDetail', categoryDetail)
    if (!categoryDetail) {
      throw new Error('The category does not exist');
    }
    if (typeof category === 'object') {
      category.categoryId = SubcategoryId;
    }
    const lastIndex = SubcategoryId.lastIndexOf('#SUB');
    let UpdateExpression = ''
    let ExpressionAttributeValues = {}
    let ExpressionAttributeNames = {}

    for (const key in category) {
      UpdateExpression +=
        (UpdateExpression.length > 0 ? ', ' : '') + ` #${key} = :${key}`
      ExpressionAttributeValues[`:${key}`] = category[key]
      ExpressionAttributeNames[`#${key}`] = key
    }

    let TableKey
    if (lastIndex !== -1) {
      TableKey = {
        PK: `CATEGORY#${SubcategoryId.substring(0, lastIndex)}`,
        SK: `CATEGORY#${SubcategoryId}`,
      }
    } else {
      TableKey = {
        PK: `CATEGORY`,
        SK: `CATEGORY#${SubcategoryId}`,
      }
    }
    
    const params = {
      TableName: this.tableName,
      Key: TableKey,
      UpdateExpression: `SET ${UpdateExpression}`,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }

    return this.adapter.update(params)
  }

  async deleteCategory(categoryId) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const categoryDetail = await this.getCategory(SubcategoryId);
    console.log('categoryDetail', categoryDetail)
    if (!categoryDetail) {
      throw new Error('The category does not exist');
    }
    const lastIndex = SubcategoryId.lastIndexOf('#SUB');
    let TableKey
    
    if (lastIndex !== -1) {
      TableKey = {
        PK: `CATEGORY#${SubcategoryId.substring(0, lastIndex)}`,
        SK: `CATEGORY#${SubcategoryId}`,
      }
    } else {
      TableKey = {
        PK: `CATEGORY`,
        SK: `CATEGORY#${SubcategoryId}`,
      }
    }
    

    const scanParams = {
      TableName: this.tableName,
      FilterExpression: "begins_with(PK, :pk)",
      ExpressionAttributeValues: {
        ":pk": `CATEGORY#${SubcategoryId}`,
      },
    };
    const subcategoriesAndBooks = await this.adapter.scan(scanParams);
    
    const deleteRequests = [
      {
        Delete: {
          TableName: this.tableName,
          Key: marshall(TableKey),
        }
      },
      ...subcategoriesAndBooks.Items.map(item => ({
        Delete: {
          TableName: this.tableName,
          Key: marshall({
            PK: item.PK,
            SK: item.SK,
          })
        }
      }))
    ];

    const transactParams = {
      TransactItems: deleteRequests,
    };

    try {
      const result = await this.adapter.transactWrite(transactParams);
      console.log('result', result)

      return transactParams;
    } catch (error) {
      return { success: false, message: `Failed to delete category: ${error.message}` };
    }
  }

  async getParentId(subcategoryId) {
    if (!subcategoryId.includes('#SUB')) {
      return null;
    }
    const parts = subcategoryId.split('#SUB');
    if (parts.length > 1) {
      return parts.slice(0, parts.length - 1).join('#SUB');
    }
    return null;
  }

  async checkBookinCategory(categoryId, bookId){
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `CATEGORY#${categoryId}`,
        SK: `BOOK#${bookId}`,
      },
    }

    return this.adapter.get(params)
  }

  async addBookToCategory({ categoryId, bookId }) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const categoryDetail = await this.getCategory(SubcategoryId);
    console.log('categoryDetail', categoryDetail)
    if (!categoryDetail) {
      throw new Error('The category does not exist');
    }
    const parentId = await this.getParentId(SubcategoryId)
    console.log('parentId', parentId)
    if (parentId) {
      const bookInParrentId = await this.checkBookinCategory(parentId, bookId);
      console.log('bookInParrentId', bookInParrentId)
      if (!bookInParrentId.Item) {
        throw new Error('The book doesnt belong to the parrent Id yet, you need to add to the parrent before put it in here');
      }
    }

    const params = {
      TableName: this.tableName,
      Item: {
        PK: `CATEGORY#${SubcategoryId}`,
        SK: `BOOK#${bookId}`,
        GSI1PK: `BOOK#${bookId}`,
        GSI1SK: `CATEGORY#${SubcategoryId}`,
        categoryId: SubcategoryId,
        bookId,
      },
    }

    return this.adapter.create(params)
  }

  async listBooksByCategory(categoryId) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
      ExpressionAttributeValues: {
        ':PK': `CATEGORY#${SubcategoryId}`,
        ':SK': 'BOOK#',
      },
    }

    return this.adapter.query(params)
  }

  async listCategoriesByBook(bookId) {
    const params = {
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :bookId',
      ExpressionAttributeValues: {
        ':bookId': `BOOK#${bookId}`,
      },
    }

    let categories
    const { Items } = await this.adapter.query(params)
    categories = await Promise.all(
      Items.map(async category => {
        const categoryDetail = await this.getCategory(
          category.categoryId
        )

        if (!categoryDetail) {
          return undefined;
        }

        return {
          categoryId: category.categoryId,
          ...categoryDetail,
        }
      })
    )
    categories = categories.filter(Boolean);
    return categories
  }

  async removeBookFromCategory({ categoryId, bookId }) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    // Step 1: Scan the table for books in the specified category
    const scanParams = {
      TableName: this.tableName,
      FilterExpression: "begins_with(PK, :pk) AND begins_with(SK, :sk)", 
      ExpressionAttributeValues: {
        ":pk": `CATEGORY#${SubcategoryId}#SUB`,
        ":sk": "BOOK#",
      },
    };

    const books = await this.adapter.scan(scanParams);

    // Step 2: Check if the book is present in the subcategory
    if (books.Items.length > 0) {
      // If a book exists in the subcategory, throw an error
      throw new Error('Book is already in the subcategory. Remove the book from the subcategory first.');
    }

    
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `CATEGORY#${SubcategoryId}`, // get all products by categoryId
        SK: `BOOK#${bookId}`,
        // GSI1PK: `PRODUCT#${productId}`, // get all categories by productId
        // GSI1SK: `CATEGORY#${categoryId}`,
      },
    }

    return this.adapter.delete(params)
  }

  async listCategories(lang, Key, depth = 0, maxDepth = 2) {
    let params = Key ? {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
      ExpressionAttributeValues: {
        ':PK': Key,
        ':SK': `${Key}#SUB`
      },
    } : {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': `CATEGORY`,
      },
    }

    const originalCategories = await this.adapter.query(params);

    if (!lang && depth >= maxDepth) {
      return originalCategories.Items;
    }

    const translatedCategoriesPromises = originalCategories.Items.map(async (category) => {
      const categoryId = category?.categoryId;
      const translatedCategory = await translationData(this.tableName, `CATEGORY#${categoryId}`, `CATEGORY#${categoryId}#LANG${lang}`);
      const categoryResult = translatedCategory ? { ...category, translations: translatedCategory } : category;
      console.log('categoryResult', categoryResult)

      const categoryKey = category?.SK;
      const subcategories = await this.listCategories(lang, categoryKey, depth + 1, maxDepth);
      if (subcategories.length > 0) {
        categoryResult.subcategories = subcategories.map(sub => ({
            id: sub.categoryId.replace('#SUB', '.'),
            ...sub
        }));
      }

      return categoryResult;
    });

    return await Promise.all(translatedCategoriesPromises);
  }
}