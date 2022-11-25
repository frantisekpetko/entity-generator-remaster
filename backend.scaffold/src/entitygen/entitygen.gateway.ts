import { EntitygenService } from './entitygen.service';
import { Data } from './data.dto';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/generator' })
export class EntitygenGateway implements OnGatewayInit, OnGatewayConnection {
  private logger: Logger = new Logger(EntitygenGateway.name)
  @WebSocketServer() wss: Server;

  constructor(private entityGenService: EntitygenService) {}

  async afterInit(server: Server) {
    try {
      const data = await this.entityGenService.getEntityData();
      this.logger.warn(JSON.stringify(data, null, 4), 'entities');
      //this.wss.emit('fireSendingDataForView');
      setTimeout(() => this.wss.emit('entities', data), 100);
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException(error)
    }
    this.logger.log('Initialized!');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    //console.log(`Client connected: ${client.id}`);

  }

  @SubscribeMessage('entities')
  async handleEntitiesMessage(client: any) {
    const data = await this.entityGenService.getEntityData();
    this.wss.emit('entities', data);
  }

  


  @SubscribeMessage('view')
  async handleMessage(client: any, entity: string){
    this.logger.warn(entity, 'entity')
    const entityDataForView = await this.entityGenService.getEntityDataForView(entity);
    this.logger.warn(JSON.stringify(entityDataForView, null, 4), 'entityDataForView')
    this.wss.emit('viewdata', entityDataForView);
  }
}
