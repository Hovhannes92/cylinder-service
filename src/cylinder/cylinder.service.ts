import { Injectable } from '@nestjs/common';
import { connect, StringCodec } from 'nats';

@Injectable()
export class CylinderService {
  private client;
  private sc = StringCodec();

  async calculateArea(radius: number, height: number): Promise<number> {
    await this.connectToNats();

    const response = await this.sendCalculationRequest({ radius, height });
    const parsedResponse = this.parseResponse(response);

    return parsedResponse;
  }

  private async connectToNats(): Promise<void> {
    if (!this.client) {
      this.client = await connect({ servers: 'nats://localhost:4222' });
    }
  }

  private async sendCalculationRequest(data: any): Promise<string> {
    const requestData = this.sc.encode(JSON.stringify(data));

    const sub = this.client.subscribe('calculatedResult');

    await this.client.publish('calculateArea', requestData);

    return new Promise<string>((resolve) => {
      (async () => {
        for await (const msg of sub) {
          resolve(this.sc.decode(msg.data));
          sub.unsubscribe();
          break;
        }
      })();
    });
  }

  private parseResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error('Invalid response data');
    }
  }
}
