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
      labelNames: ['your_label'],
      registers: [this.registry],
    });

    this.processingTimeSummary = new Summary({
      name: 'nats_messages_processing_time',
      help: 'NATS messages processing time',
      labelNames: ['your_label2'],
      registers: [this.registry],
    });

    this.statusCounter = new Counter({
      name: 'nats_messages_status_counter',
      help: 'NATS messages status counter',
      labelNames: ['your_label3'],
      registers: [this.registry],
    });
  }

  use(req: any, res: any, next: () => void) {
    const start = process.hrtime();

    this.messagesCounter.labels('your_label').inc();

    res.on('finish', () => {
      const duration = process.hrtime(start);
      const processingTime = duration[0] * 1000 + duration[1] / 1e6;
      this.processingTimeSummary.labels('your_label').observe(processingTime);
      this.statusCounter.labels('your_label').inc(res.statusCode.toString());
    });

    next();
  }
}
