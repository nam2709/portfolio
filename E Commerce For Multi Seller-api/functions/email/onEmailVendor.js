import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import { object } from 'yup';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { isCreateVendor, isApprovedVendor } from './logic.js';

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
        // TODO: Prepare data action to send email when a vendor been create
        if (isCreateVendor(record)) {
          const payload = {
            ...newImage,
            email_template: 'thankvendorsignup',
            subject_email: 'Cảm ơn bạn đã đăng ký cửa hàng ở Kamarket'
          }
          const event = {
            action: 'ThankVendorSignUp',
            payload: payload,
          };
          const result = await service.handler(event);
          console.log('result', result);

        // TODO: Prepare data action to send email when approved vendor
        } else if (isApprovedVendor(record, newImage, oldImage)) {
          const payload = {
            ...newImage,
            email_template: 'congratulatevendor',
            subject_email: 'Chúc mừng bạn đã có cửa hàng trên Kamarket'
          }
          const event = {
            action: 'CongratulateVendor',
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
