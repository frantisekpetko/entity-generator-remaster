import { Module } from '@nestjs/common';
import { EntitygenController } from './entitygen.controller';
import { EntitygenService } from './entitygen.service';
import { EntitygenGateway } from './entitygen.gateway';

@Module({
  controllers: [EntitygenController],
  providers: [EntitygenService, EntitygenGateway],
})
export class EntitygenModule {}
