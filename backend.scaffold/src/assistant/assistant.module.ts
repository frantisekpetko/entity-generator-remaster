import { EntitygenService } from './../entitygen/entitygen.service';
import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';

@Module({
  controllers: [AssistantController],
  providers: [AssistantService, EntitygenService]
})
export class AssistantModule {}
