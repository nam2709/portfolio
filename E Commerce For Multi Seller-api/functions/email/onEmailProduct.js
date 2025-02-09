import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import { object } from 'yup';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { isCreateProduct } from './logic.js';

import EmailService from 'services/EmailService'

const schema = {
  body: object().required(),
};

export async function handleCreateEmail(event) {
  const records = event.Records;
  let batchItemFailures = [];

  if (records.length) {
    for (const record of records) {
      try {
        const service = new EmailService();
        const newImage = unmarshall(record?.dynamodb?.NewImage);
        const oldImage = record?.dynamodb?.OldImage ? unmarshall(record?.dynamodb?.OldImage) : null;
        // TODO: Prepare data action to send email when a product been create
        if (isCreateProduct(record)) {
          const payload = {
            ...newImage,
            email_template: 'createproduct',
            subject_email: 'Sản phẩm được tạo lập trong cửa hàng Kamarket'
          }
          const event = {
            action: 'CreateProduct',
            payload: payload,
          };
          const result = await service.handler(event);
          console.log('result', result);

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
