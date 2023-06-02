import { Provider } from '@nestjs/common';
import { Counter, Summary, Registry } from 'prom-client';

export const MetricsProvider: Provider[] = [
  {
    provide: 'PrometheusRegistry',
    useValue: new Registry(),
  },
  {
    provide: 'NATS_MESSAGES_COUNTER',
    useFactory: (registry: Registry) =>
      new Counter({
        name: 'nats_messages_counter',
        help: 'Total number of NATS messages',
        registers: [registry],
      }),
    inject: ['PrometheusRegistry'],
  },
  {
    provide: 'NATS_MESSAGES_PROCESSING_TIME',
    useFactory: (registry: Registry) =>
      new Summary({
        name: 'nats_messages_processing_time',
        help: 'Processing time of NATS messages',
        registers: [registry],
      }),
    inject: ['PrometheusRegistry'],
  },
  {
    provide: 'NATS_MESSAGES_STATUS_COUNTER',
    useFactory: (registry: Registry) =>
      new Counter({
        name: 'nats_messages_status_counter',
        help: 'Status codes of NATS message responses',
        labelNames: ['status'],
        registers: [registry],
      }),
    inject: ['PrometheusRegistry'],
  },
];
