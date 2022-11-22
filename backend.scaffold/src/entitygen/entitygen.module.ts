import { Module } from '@nestjs/common';
import { EntitygenController } from './entitygen.controller';
import { EntitygenService } from './entitygen.service';

@Module({
  controllers: [EntitygenController],
  providers: [EntitygenService],
})
export class EntitygenModule {}
