import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import { object } from 'yup';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { isCreateOrder } from './logic.js';
import { getProfile } from 'functions/auth/me'

import EmailService from 'services/EmailService'
import OrderService from 'services/OrderService'
import VendorService from 'services/vendor.service'
import ProductService from 'services/ProductService'

const schema = {
  body: object().required(),
};

export async function handleCreateEmail(event) {
  const records = event.Records;
  let batchItemFailures = [];

  if (records.length) {
    for (const record of records) {
      try {
        const emailService = new EmailService();
        const orderService = new OrderService();
        const vendorService = new VendorService();
        const productService = new ProductService();

        const newImage = unmarshall(record?.dynamodb?.NewImage);
        if (newImage?.orderId && newImage?.userId) {
          const orderId = newImage?.orderId
          const userId = newImage?.userId
          const { Items } = await orderService.getOrder({ userId, orderId })
          let order = {}
          const products = []
          Items.forEach(item => {
            if (item.EntityType === 'ORDER_ITEM') {
              products.push(item)
            } else if (item.EntityType === 'ORDER') {
              order = item
            }
          })
          console.log('orderorderorderorderorder', order)
          console.log('productsproducts', products)

          const productPromises = products.map(async (p) => {
            try {
              console.log(p.productId);
              const product = await productService.getProduct(p.productId);
              return product;
            } catch (error) {
              console.error('ERROR WHILE READING PRODUCT', error.message);
              return null;
            }
          });
      
          const results = await Promise.all(productPromises);
          console.log('resultsresultsresultsresultsresults', results);

          // TODO: Prepare data action to send email when a order been create
          if (isCreateOrder(record)) {
            const payload = {
              ...order,
              products: results,
              email_template: 'orderconfirmation',
              subject_email: 'Đơn hàng của bạn đã được tạo lập trên Kamarket'
            }
            const event = {
              action: 'OrderConfirmation',
              payload: payload,
            };
            const result = await emailService.handler(event);
            console.log('result', result);
          }
        }
      } catch (err) {
        console.error('Error processing record:', err.message);
        batchItemFailures.push({
          itemIdentifier: record.messageId,
        });
      }
    }
  }

  return { batchItemFailures };  // Return failed items for batch processing
}

export const createEmail = middy(handleCreateEmail)
  // .use(httpErrorHandler())
  // .use(jsonBodyParser())
  .use(cors())
