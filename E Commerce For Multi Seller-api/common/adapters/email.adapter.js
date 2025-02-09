import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

export class EmailAdapter {
    constructor() {
        this.client = new SESClient()
    }

    async sendEmail(input) {
        return this.client.send(new SendEmailCommand(input))
    }
}
  