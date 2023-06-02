import { Module } from '@nestjs/common';
import { CylinderController } from './cylinder.controller';
import { CylinderService } from './cylinder.service';

@Module({
  controllers: [CylinderController],
  providers: [CylinderService],
})
export class CylinderModule {}
