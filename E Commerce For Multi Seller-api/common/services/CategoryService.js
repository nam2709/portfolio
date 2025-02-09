import { v4 } from 'uuid'

import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { translationData } from '../../libs/translation'

// import { flexId } from 'adapters/flexid.adapter'
// import ProductService from './ProductService'

export default class CategoryService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_CATEGORIES_NAME
  }

  async getCategory(categoryId, lang) {
    console.log('categoryIdcategoryId', categoryId)
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
    console.log('category', category)

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

    if (data?.lang) {
      const createCategory = await this.createCategoryLang(category)
      console.log('createCategory', createCategory)
    }

    const params = {
      TableName: this.tableName,
      Item: category,
    }

    return this.adapter.create(params).then(() => category)
  }

  async createCategoryLang(data) {
    if (!data?.categoryId || !data?.lang) {
      throw new Error('Both categoryId and lang are required to create a category translation.');
    }

    const SubcategoryId = data?.categoryId.replace(/\./g, '#SUB');

    const category = {
      PK: `CATEGORY#${SubcategoryId}`,
      SK: `CATEGORY#${SubcategoryId}#LANG${data?.lang}`,
      type: 'translation',
      name: data?.name || undefined,
      description: data?.description || undefined,
      slug: data?.slug || undefined
    }

    const params = {
      TableName: this.tableName,
      Item: category,
    }

    return this.adapter.create(params).then(() => category)
  }

  async updateCategory(categoryId, category) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
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
    if (category?.type == 'translation') {
      TableKey = {
        PK: `CATEGORY#${categoryId}`,
        SK: `CATEGORY#${categoryId}#LANG${category?.lang}`,
      }
    } else {
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

  async deleteCategory(categoryId, type) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const lastIndex = SubcategoryId.lastIndexOf('#SUB');
    let TableKey
    if (type == 'translation') {
      TableKey = {
        PK: `CATEGORY#${SubcategoryId}`,
        SK: `CATEGORY#${SubcategoryId}#LANG${SubcategoryId?.lang}`,
      }
    } else {
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
    }

    const params = {
      TableName: this.tableName,
      Key: TableKey,
    }

    return this.adapter.delete(params)
  }

  async addProductToCategory({ categoryId, productId }) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const params = {
      TableName: this.tableName,
      Item: {
        PK: `CATEGORY#${SubcategoryId}`,
        SK: `PRODUCT#${productId}`,
        GSI1PK: `PRODUCT#${productId}`,
        GSI1SK: `CATEGORY#${SubcategoryId}`,
        categoryId: SubcategoryId,
        productId,
      },
    }

    return this.adapter.create(params)
  }

  async listProductsByCategory(categoryId) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
      ExpressionAttributeValues: {
        ':PK': `CATEGORY#${SubcategoryId}`,
        ':SK': 'PRODUCT#',
      },
    }

    return this.adapter.query(params)
  }

  async listCategoriesByProduct(productId) {
    const params = {
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :productId',
      ExpressionAttributeValues: {
        ':productId': `PRODUCT#${productId}`,
      },
    }

    return this.adapter.query(params)
  }

  async removeProductFromCategory({ categoryId, productId }) {
    const SubcategoryId = categoryId.replace(/\./g, '#SUB');
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `CATEGORY#${SubcategoryId}`, // get all products by categoryId
        SK: `PRODUCT#${productId}`,
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