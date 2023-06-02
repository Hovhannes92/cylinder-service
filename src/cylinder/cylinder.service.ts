import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class CylinderService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        url: 'nats://localhost:4222',
      },
    });
  }

  async calculateArea(radius: number, height: number): Promise<number> {
    return await this.client
      .send<number>({ cmd: 'calculateArea' }, { radius, height })
      .toPromise();
  }
}
