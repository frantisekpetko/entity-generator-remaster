import { EnvService } from './../entitygen/envService.service';
import { SocketsGateway } from './../sockets/sockets.gateway';
import { EntitygenService } from './../entitygen/entitygen.service';
import { Module, forwardRef } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';

@Module({
  controllers: [AssistantController],
  providers: [AssistantService, EntitygenService, EnvService]
})
export class AssistantModule {}
