import { ReturnConsumedCapacity } from '@aws-sdk/client-dynamodb'
import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { flexId } from 'adapters/flexid.adapter'
import ProductEntity, { ProductStatus } from 'entities/ProductEntity'

export default class ProductService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_PRODUCTS_NAME
  }

  async create(data) {
    const productId = flexId()
    const product = new ProductEntity({
      vendorId: data.vendorId,
      // store_id: data.vendorId,
      productId,
      // id: productId,
      name: data.name,
      description: data.description,
      // short_description: data.short_description,
      status: ProductStatus.PENDING,
      quantity: data.quantity || 0,
      price: data.price || 0,
    })

    return this.adapter.createItem(this.tableName, product)
  }

  async createProduct(vendorId, product) {
    const productId = flexId()
    const createdAt = new Date().toISOString()
    const status = ProductStatus.PENDING

    const quantity = product?.quantity ? parseInt(product.quantity) : 0

    const newProduct = {
      PK: `PRODUCT#${productId}`, // get product by  productId
      SK: `PRODUCT#${productId}`,
      GSI1PK: `VENDOR#${vendorId}`, // get all products by vendor
      GSI1SK: `PRODUCT#${productId}`,
      GSI2PK: `STATUS#${status}`, // get all products by status
      GSI2SK: createdAt,
      EntityType: 'PRODUCT',
      ...product,
      vendorId,
      store_id: vendorId,
      productId,
      id: productId,
      isActive: false,
      status,
      is_approved: 0,
      stock_status: quantity > 0 ? 'in_stock' : 'out_of_stock',
      createdAt,
      created_at: createdAt,
      orders_count: 0, //TODO
      reviews_count: 0, // TODO
      rating_count: 0, // TODO
      review_ratings: product?.review_ratings || [0, 0, 0, 0, 0], // TODO:
      related_products: product?.related_products || [],
      cross_sell_products: product?.cross_sell_products || [],
      product_thumbnail: product?.product_thumbnail || {},
      product_galleries: product?.product_galleries || [],
      // reviews: // TODO: From reviews table
      // store: // TODO From store/vendor table
      // categories: // TODO: From categories table
      // tags: // TODO: From tags table
      // attributes: // TODO: From attributes table
      // variations: // TODO: From variations table
    }

    const params = {
      TableName: this.tableName,
      Item: newProduct,
    }

    return this.adapter.create(params).then(res => newProduct)
  }

  async updateProduct(productId, vendorId, product) {
    let UpdateExpression = 'SET'
    const ConditionExpression = `vendorId = :vendorId`
    let ExpressionAttributeValues = {
      ':vendorId': vendorId,
    }
    let ExpressionAttributeNames = {
      // vendorId: 'vendorId',
    }

    product.updatedAt = new Date().toISOString()

    Object.keys(product).forEach((key, index) => {
      if (
        [
          'GSI1PK',
          'GSI1SK',
          'GSI2PK',
          'GSI2SK',
          'EntityType',
          'status',
          'isActive',
          'vendorId',
          'reviewedAt',
          'productId',
        ].includes(key)
      )
        return

      const value = product[key]
      const name = `#${key}`
      const valueKey = `:${key}`

      UpdateExpression += ` ${name} = ${valueKey}`
      ExpressionAttributeNames[name] = key
      ExpressionAttributeValues[valueKey] = value

      if (index < Object.keys(product).length - 1) {
        UpdateExpression += ','
      }
    })

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
      },
      UpdateExpression,
      ConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'UPDATED_NEW',
    }

    console.dir(params, { depth: 3 })

    return this.adapter.update(params)
  }

  async updateProductSell(productId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
      },
      UpdateExpression: 'SET orders_count = orders_count + :val',
      ExpressionAttributeValues: {
        ':val': 1,
      },
      ReturnValues: 'ALL_NEW',
    };
    console.log('params', params)

    return this.adapter.update(params);
  }

  // query product by productId
  async getById(productId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
      },
    }

    return this.adapter.get(params)
  }

  async getProduct(productId) {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
      },
    }

    return this.adapter
      .get(params)
      .then(({ Item }) => Item)
      .catch(error => null)
  }

  async userListProducts(userId) {
    const params = {
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
      },
      // ProjectionExpression:
      //   'productId, name, description, quantity, price, status',
    }

    return this.adapter.query(params)
  }

  // async reviewProduct(productId, review) {}

  async vendorListProducts({ vendorId, status, limit, nextToken }) {
    let params = {
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `VENDOR#${vendorId}`,
      },
      Limit: limit,
      // ScanIndexForward: true,
      //TODO: Pagination ExclusiveStartKey: nextToken,
    }

    if (status) {
      params = {
        ...params,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ...params.ExpressionAttributeValues,
          ':status': status,
        },
      }
    }

    return this.adapter.query(params)
  }

  async adminListProducts({ status, limit, nextToken }) {
    let params = {
      TableName: this.tableName,
    }

    if (status) {
      const params = {
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :status',
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

    return params.IndexName ? this.adapter.query(params) : this.adapter.scan(params)
  }

  async adminReviewProduct({ productId, query = { status: null } }) {
    const reviewedAt = new Date().toISOString()
    const status = ProductStatus.APPROVED
    const isActive = status === ProductStatus.APPROVED

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
      },
      UpdateExpression:
        'SET #status = :status, GSI2PK = :gsi2sk, isActive = :isActive, reviewedAt = :reviewedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':gsi2sk': `STATUS#${status}`,
        ':isActive': isActive,
        ':reviewedAt': reviewedAt,
      },
      ReturnValues: 'UPDATED_NEW',
    }

    return this.adapter.update(params)
  }

  async adminDisableProduct({ productId, query = { status: null } }) {
    const reviewedAt = new Date().toISOString()
    const status = ProductStatus.DISABLE
    const isActive = false

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
      },
      UpdateExpression:
        'SET #status = :status, GSI2PK = :gsi2sk, isActive = :isActive, reviewedAt = :reviewedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':gsi2sk': `STATUS#${status}`,
        ':isActive': isActive,
        ':reviewedAt': reviewedAt,
      },
      ReturnValues: 'UPDATED_NEW',
    }

    return this.adapter.update(params)
  }

  async searchProducts(query) {
    const status = query?.status || ProductStatus.APPROVED;
    const vendorId = query?.vendorId;
  
    let params = {
      TableName: this.tableName,
      IndexName: 'GSI2',
      KeyConditionExpression: '#PK = :status',
      ExpressionAttributeNames: {
        '#PK': 'GSI2PK',
      },
      ExpressionAttributeValues: {
        ':status': `STATUS#${status}`,
      },
      Limit: parseInt(query?.limit || 10),
    };
  
    // Combine FilterExpressions if 'name' and/or 'vendorId' are provided
    let filterExpressions = [];
    
    if (query?.name) {
      filterExpressions.push('contains(#name, :query)');
      params.ExpressionAttributeNames['#name'] = 'name';
      params.ExpressionAttributeValues[':query'] = query.name;
    }
  
    if (vendorId) {
      filterExpressions.push('contains(#vendorId, :vendorId)');
      params.ExpressionAttributeNames['#vendorId'] = 'vendorId';
      params.ExpressionAttributeValues[':vendorId'] = vendorId;
    }
  
    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    }
  
    return this.adapter.query(params);
  }  

  async batchGetProducts(ids) {
    const keys = ids.map(id => ({
      PK: `PRODUCT#${id}`,
      SK: `PRODUCT#${id}`,
    }))

    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    }
    console.dir(params, { depth: 5 })

    return this.adapter.batchGet(params).then(res => res.Responses[this.tableName])
  }

  async deleteProduct(productId) {
    const params = {
        TableName: this.tableName,
        Key: {
            PK: `PRODUCT#${productId}`,
            SK: `PRODUCT#${productId}`
        }
    };

    return this.adapter.delete(params)
  }
}
