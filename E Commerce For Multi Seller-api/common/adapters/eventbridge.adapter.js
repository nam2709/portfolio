import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

export class EventBridgeAdapter {
    constructor() {
      this.client = new EventBridgeClient({
        region: process.env.AWS_REGION,
      })
    }
  
    async putEvents(parameters) {
        return await this.client.send(new PutEventsCommand(parameters))
    }
}
