import { ReturnValue } from '@aws-sdk/client-dynamodb'
import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'
import { flexId } from 'adapters/flexid.adapter'
import { OrderStatus, OrderStatusMap, PaymentMethod, PaymentStatus } from 'entities/OrderEntity'

const allowedVendorStatus = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.CANCELLED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERIED,
  OrderStatus.DELIVERED,
]

export default class OrderService {
  constructor(adapter) {
    this.adapter = adapter || new DynamoDbAdapter()
    this.tableName = process.env.TABLE_ORDERS_NAME
  }

  /**
   * Query index GSI2 to get all orders by userId
   * @param {} userId
   * @returns
   */
  async listOrders(userId) {
    const params = {
      TableName: this.tableName,
      IndexName: 'GSI2',
      KeyConditionExpression: 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': `USER#${userId}`,
      },
      // ProjectionExpression: 'orderId, Amount, CreatedAt',
    }

    return this.adapter.query(params)
  }

  /**
   * User place an new order.
   * TODO: Cân nhắc kỹ về index GSI1 và GSI2
   *
   * @param {*} userId
   * @param {*} products
   * @returns
   */
  async placeOrder({
    userId,
    products,
    shipping_address,
    billing_address = undefined,
    payment_method = PaymentMethod.COD,
    // payment_status = PaymentStatus.PENDING,
    delivery_description = undefined,
    delivery_interval = undefined,
    shipping_total = 0,
    points_amount = 0,
    tax_total = 0,
  }) {
    //TODO: group products by vendorId
    // create order for each vendor
    // return parent order
    console.log({
      userId,
      products,
      shipping_address,
      payment_method,
      delivery_description,
    })
    const orderId = flexId()
    const createdAt = new Date().toISOString()
    const status = OrderStatus.PENDING //TODO: From params
    const payment_status = PaymentStatus.PENDING //TODO: From params
    const vendorId = products[0].vendorId

    const amount = products.reduce((total, product) => {
      return total + parseInt(product.price, 0) * parseInt(product.quantity, 0)
    }, 0)
    const total = amount + tax_total + shipping_total

    const order = {
      PutRequest: {
        Item: {
          PK: `ORDER#${orderId}`, //TODO: 1. get order detail by orderId
          SK: `USER#${userId}`,
          GSI1PK: `USER#${userId}`, //TODO 2. get all orders by given consumerId (buyer)
          GSI1SK: `ORDER#${orderId}`,
          GSI2PK: `VENDOR#${vendorId}`, //TODO 6. get all orders by given vendorId (for vendor)
          GSI2SK: `ORDER#${createdAt}`,
          GSI3PK: `STATUS#${status}`, //TODO 3. get all orders by given order_status (for vendor & admin)
          GSI3SK: `ORDER#${createdAt}`,
          // GSI4PK: EntityType get all orders in time range
          // GSI4SK: createdAt
          GSI5PK: `PAYMENT#${payment_status}`, //TODO 7. get all orders by given payment status (for vendor & admin)
          GSI5SK: createdAt,
          EntityType: 'ORDER', // GSI4 (EntityType / createdAt) get all orders in time range
          userId,
          consumer_id: userId,
          vendorId,
          store_id: vendorId,
          orderId,
          order_number: orderId,
          order_status: {
            ...OrderStatusMap[status],
            created_at: createdAt,
            updated_at: undefined,
          },
          payment_status,
          amount: amount || 0,
          total: total || 0,
          createdAt: createdAt,
          created_at: createdAt,
          shipping_address,
          billing_address,
          payment_method,
          shipping_total: shipping_total || 0,
          points_amount: points_amount || 0,
          delivery_description,
          delivery_interval,
          deliveried_at: undefined,
        },
      },
    }

    const orderItems = products.map(product => ({
      PutRequest: {
        Item: {
          PK: `ORDER#${orderId}`, // get all products in this order
          SK: `PRODUCT#${product.productId}`,
          EntityType: 'ORDER_ITEM', // (GSI4 - EntityType / createdAt) get all products
          userId,
          orderId,
          productId: product.productId,
          quantity: parseInt(product.quantity),
          vendorId: product.vendorId,
          price: parseInt(product.price),
          createdAt,
          product: product?.product,
          GSI1PK: `USER${userId}`, //TODO 8. get all products sold to userId. check if user buy this product
          GSI1SK: `PRODUCT#${createdAt}`,
          GSI2PK: `VENDOR#${product.vendorId}`, //TODO 5. get all products by given vendorId (for vendor)
          GSI2SK: `PRODUCT#${createdAt}`,
          GSI3PK: `PRODUCT#${product.productId}`, //TODO 4. get all orders by given productId (for vendor)
          GSI3SK: `ORDER#${orderId}`,
          // GSI4PK: EntityType (ORDER_ITEM)
          // GSI4SK: createdAt
          // GSI4: (EntityType / createdAt) get all products sold in time range
        },
      },
    }))
    const params = {
      RequestItems: {
        [this.tableName]: [order].concat(orderItems),
      },
    }

    // console.log(JSON.stringify(params, null, 2))

    return this.adapter
      .batchWrite(params)
      .then(() => orderId)
      .catch(error => {
        throw error
      })
  }

  async getOrder({ userId, orderId }) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': `ORDER#${orderId}`,
      },
    }

    return this.adapter.query(params)
  }

  async queryOrder(orderId, userId = null) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': `ORDER#${orderId}`,
      },
    }

    return userId ? this.adapter.query(params) : this.adapter.get(params).then(res => res.Item)
  }

  async getOrderById(orderId, userId = null) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK and begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':PK': `ORDER#${orderId}`,
        ':sk': `USER#${userId ? userId : ''}`,
      },
    }

    const order = userId
      ? await this.adapter.get(params).then(res => res.Item)
      : await this.adapter.query(params).then(res => (res.Items?.length ? res.Items[0] : null))

    return {
      ...order,
      id: order.orderId,
      order_number: order.orderId,
      created_at: order.createdAt,
      total: order?.total || order?.amount,
      order_status: OrderStatusMap[order.status || 'PENDING'],
    }
  }

  async updateOrder({ orderId, userId, order }) {
    let params = {
      TableName: this.tableName,
      Key: {
        PK: `ORDER#${orderId}`,
        SK: `USER#${userId}`,
      },
    }
    if (order?.status && allowedVendorStatus.includes(order.status)) {
      params = {
        ...params,
        UpdateExpression: 'SET #status = :status, GSI3PK = :gsi3pk, order_status = :order_status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': order.status,
          ':order_status': OrderStatusMap[order.status],
          ':gsi3pk': `STATUS#${order.status}`,
        },
        ReturnValues: ReturnValue.ALL_NEW,
      }
    } else {
      throw new Error('Invalid order status')
    }

    //TODO: Update payment_status

    return this.adapter.update(params).then(res => res.Attributes)
  }

  async getProductsByUser(userId, productId) {
    const params = {
      TableName: this.tableName,
      IndexName: 'GSI5',
      KeyConditionExpression: 'userId = :userId AND SK = :sk',
      ExpressionAttributeValues: {
        ':userId': `${userId}`,
        ':sk': `PRODUCT#${productId}`
      },
    };
    console.log('Query Params:', params);

    return await this.adapter.query(params);
  }

  async getProductsById(orderId) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :PK AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':PK': `ORDER#${orderId}`,
        ':sk': `PRODUCT#`,
      },
    }

    const products = await this.adapter.query(params).then(res => res.Items)
    const result = products.map(p => {
      const product = p?.product?.product || p?.product
      return {
        is_return: p?.is_return || 0,
        name: product?.name,
        product_thumbnail: product?.product_thumbnail,
        pivot: {
          productId: p?.productId,
          is_refunded: p?.is_refunded || 0,
          single_price: parseInt(p?.price),
          quantity: parseInt(p?.quantity),
          subtotal: parseInt(p?.price) * parseInt(p?.quantity),
        },
      }
    })

    return result
  }

  async createInvoice(userId, orderId, amount) {
    const invoiceId = flexId()
    const createdAt = new Date().toISOString()

    const invoice = {
      TableName: this.tableName,
      Item: {
        PK: `ORDER#${orderId}`,
        SK: `INVOICE#${orderId}`,
        EntityType: 'INVOICE',
        Amount: amount,
        userId,
        orderId,
        invoiceId,
        GSI1PK: `INVOICE#${invoiceId}`,
        GSI1SK: `INVOICE#${invoiceId}`,
        GSI2PK: `USER#${userId}`,
        GSI2SK: `INVOICE#${createdAt}`,
        createdAt,
      },
    }

    return this.adapter.create(invoice)
  }

  async createShipment(orderId, products, address) {
    const shipmentId = flexId()
    const createdAt = new Date().toISOString()

    const shipment = {
      PutRequest: {
        Item: {
          PK: `ORDER#${orderId}`,
          SK: `SHIPMENT#${shipmentId}`,
          EntityType: 'SHIPMENT',
          orderId,
          shipmentId,
          address,
          GSI1PK: `SHIPMENT#${shipmentId}`,
          GSI1SK: `SHIPMENT#${shipmentId}`,
          // GSI2PK: `SHIPMENT#${createdAt}`,
          // GSI2SK: `ORDER#${orderId}`,
          createdAt,
        },
      },
    }

    const shipmentItems = products.map(product => {
      const shipmentItemId = flexId()
      return {
        PutRequest: {
          Item: {
            PK: `ORDER#${orderId}`,
            SK: `SHIPMENTITEM#${shipmentItemId}`,
            EntityType: 'SHIPMENTITEM',
            orderId,
            shipmentId,
            productId: product.productId,
            quantity: parseInt(product.quantity || 0),
            GSI1PK: `SHIPMENT#${shipmentId}`,
            GSI1SK: `PRODUCT#${product.productId}`,
            // vendorId: product.vendorId,
            // price: parseInt(product.price || 0),
            createdAt,
          },
        },
      }
    })

    return this.adapter.create(shipment)
  }

  async adminListOrders(query) {
    let params = {
      TableName: this.tableName,
    }
    if (query?.status) {
      // get all orders by given status: index GSI3
      params = {
        ...params,
        IndexName: 'GSI3',
        KeyConditionExpression: 'GSI3PK = :status',
        ExpressionAttributeValues: {
          ':status': `STATUS#${query.status}`,
        },
      }
    } else if (query?.userId) {
      // get all orders by given userId: index GSI1
      params = {
        ...params,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :userId',
        ExpressionAttributeValues: {
          ':userId': `USER#${query.userId}`,
        },
      }
    } else if (query?.vendorId) {
      // get all orders by given vendorId: index GSI2
      params = {
        ...params,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :vendorId',
        ExpressionAttributeValues: {
          ':vendorId': `VENDOR#${query.vendorId}`,
        },
      }
    } else {
      params = {
        ...params,
        IndexName: 'GSI4',
        KeyConditionExpression: 'EntityType = :orderType',
        ExpressionAttributeValues: {
          ':orderType': 'ORDER',
        },
      }
    }

    if (query?.limit) {
      params = {
        ...params,
        Limit: query.limit,
      }
    }

    if (query?.nextToken) {
      params = {
        ...params,
        ExclusiveStartKey: query.nextToken,
      }
    }

    return params.IndexName ? this.adapter.query(params) : this.adapter.scan(params)
  }

  async listOrdersByUser({ userId, query }) {
    let params = {
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :userId',
      ExpressionAttributeValues: {
        ':userId': `USER#${userId}`,
      },
      // Limit: parseInt(query?.limit),
      // ProjectionExpression: 'orderId, Amount, CreatedAt',
    }
    if (query?.status) {
      params = {
        ...params,
        FilterExpression: 'GSI1SK = :status',
        // KeyConditionExpression: 'GSI1PK = :userId AND GSI1SK = :status',
        ExpressionAttributeValues: {
          ':userId': `USER#${userId}`,
          ':status': `STATUS#${query.status}`,
        },
      }
    }

    return this.adapter.query(params)
  }

  async listOrdersByVendor(vendorId, query) {
    let params = {
      TableName: this.tableName,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :vendorId and begins_with(GSI2SK, :orderType)',
      ExpressionAttributeValues: {
        ':vendorId': `VENDOR#${vendorId}`,
        ':orderType': 'ORDER',
      },
    }

    if (query?.limit && parseInt(query.limit) > 0) {
      params.Limit = parseInt(query.limit)
    }

    if (query?.status) {
      params = {
        ...params,
        FilterExpression: 'GSI2SK = :status',
        ExpressionAttributeValues: {
          ':vendorId': `VENDOR#${vendorId}`,
          ':orderType': 'ORDER',
          ':status': `STATUS#${query.status}`,
        },
      }
    }

    return this.adapter.query(params)
  }
}
