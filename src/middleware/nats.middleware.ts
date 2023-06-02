import { Injectable, NestMiddleware } from '@nestjs/common';
import { Counter, Summary, Registry } from 'prom-client';

@Injectable()
export class MyNatsMiddleware implements NestMiddleware {
  private readonly messagesCounter: Counter<string>;
  private readonly processingTimeSummary: Summary<string>;
  private readonly statusCounter: Counter<string>;

  constructor(private readonly registry: Registry) {
    this.messagesCounter = new Counter({
      name: 'nats_messages_counter',
      help: 'NATS messages counter',
      labelNames: ['messages_counter'],
      registers: [this.registry],
    });

    this.processingTimeSummary = new Summary({
      name: 'nats_messages_processing_time',
      help: 'NATS messages processing time',
      labelNames: ['messages_processing_time'],
      registers: [this.registry],
    });

    this.statusCounter = new Counter({
      name: 'nats_messages_status_counter',
      help: 'NATS messages status counter',
      labelNames: ['messages_status_counter', 'statusCode'], // Add the "statusCode" label here
      registers: [this.registry],
    });
  }

  use(req: any, res: any, next: () => void) {
    const start = process.hrtime();

    this.messagesCounter.inc({ messages_counter: 'value' });

    res.on('finish', () => {
      const duration = process.hrtime(start);
      const processingTime = duration[0] * 1000 + duration[1] / 1e6;
      this.processingTimeSummary.observe(
        { messages_processing_time: 'value' },
        processingTime,
      );
      this.statusCounter.inc({
        messages_status_counter: 'value',
        statusCode: res.statusCode.toString(),
      });
    });

    next();
  }
}
