import { Controller, Get, Param } from '@nestjs/common';
import { CylinderService } from './cylinder.service';

@Controller('cylinder')
export class CylinderController {
  constructor(private readonly cylinderService: CylinderService) {}

  @Get(':radius/:height')
  async calculateArea(
    @Param('radius') radius: number,
    @Param('height') height: number,
  ) {
    return this.cylinderService.calculateArea(radius, height);
  }
}
