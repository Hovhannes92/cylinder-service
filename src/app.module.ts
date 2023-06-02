import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PromModule } from '@digikare/nestjs-prom';
import { CylinderModule } from './cylinder/cylinder.module';
import { MyNatsMiddleware } from './middleware/nats.middleware';
import { MetricsProvider } from './providers/metrics.provider';
import { MyExceptionFilter } from './exception/exception.filter';
import { Registry } from 'prom-client';

@Module({
  imports: [
    PromModule.forRoot({
      defaultMetrics: {
        enabled: true,
      },
    }),
    CylinderModule,
  ],
  providers: [
    ...MetricsProvider,
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter,
    },
    Registry,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MyNatsMiddleware).forRoutes('*');
  }
}
