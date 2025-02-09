import { EmailAdapter } from 'adapters/email.adapter.js';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export default class EmailService {
  constructor() {
    this.adapter = new EmailAdapter();
  }

  async formatVND(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  async createInput(payload, html, toEmail) {
    const fromEmail = '9namancam@gmail.com';
    const bccEmail = '9namancam@gmail.com';

    return {
      Destination: {
        BccAddresses: [bccEmail],
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Html: { Charset: 'UTF-8', Data: html },
          Text: { Charset: 'UTF-8', Data: html },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: payload?.subject_email,
        },
      },
      Source: `"Kamarket" <${fromEmail}>`,
      ReplyToAddresses: [fromEmail],
    };
  }

  async createEmail(payload) {
    const templatePath = path.resolve(__dirname, `../../functions/email/email-templates/${payload?.email_template}.html`);
    let templateSource;
    
    try {
      templateSource = fs.readFileSync(templatePath, 'utf8');
    } catch (err) {
      throw new Error(`Failed to load email template: ${err.message}`);
    }

    const template = Handlebars.compile(templateSource);
    const html = template(payload);
    const toEmail = payload?.email || 'ngohanam2709@gmail.com';

    if (!toEmail) return;

    return this.createInput(payload, html, toEmail);
  }

  async emailManagement(action, payload) {
    switch (action) {
      case 'ThankVendorSignUp':
      case 'CongratulateVendor':
      case 'OrderConfirmation':
      case 'CreateProduct':
        return await this.createEmail(payload);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async handler(event) {
    const input = await this.emailManagement(event.action, event.payload);
    return this.adapter.sendEmail(input);
  }
}
