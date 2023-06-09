import { EnvService } from './envService.service';
import { EntitygenGateway } from './entitygen.gateway';
import { SocketsModule } from './../sockets/sockets.module';
import { Module, forwardRef } from '@nestjs/common';
import { EntitygenController } from './entitygen.controller';
import { EntitygenService } from './entitygen.service';
import { SocketsGateway } from '../sockets/sockets.gateway';

@Module({
  controllers: [EntitygenController],
  providers: [EntitygenService, EntitygenGateway, EnvService],
  exports: [EntitygenService, EntitygenGateway],

})
export class EntitygenModule {}
