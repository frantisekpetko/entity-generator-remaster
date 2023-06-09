import { EntitygenService } from './entitygen.service';
import { Data } from './data.dto';
import { InternalServerErrorException, Logger, OnModuleInit, OnApplicationBootstrap, Injectable, HttpException, HttpStatus, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, OnGatewayConnection, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import { WebsocketExceptionsFilter } from '../shared/websocket-exception.filter';


@WebSocketGateway({ namespace: '/generator', cors: true })
@UseFilters(new WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
@Injectable()
export class EntitygenGateway implements OnGatewayInit, OnGatewayConnection, OnModuleInit, OnApplicationBootstrap {
    private logger: Logger = new Logger(EntitygenGateway.name);
    @WebSocketServer() wss: Server;

    constructor(private entityGenService: EntitygenService) { }

    async onModuleInit() {
        this.wss.emit('fireSendingDataForView');



        try {
            const data = await this.entityGenService.getEntityData();
            this.logger.warn(JSON.stringify(data, null, 4), 'entities');
            this.wss.emit('entities', data)
            setTimeout(() => this.wss.emit('entities', data), 750);
            //this.wss.emit('entities', data)
        } catch (error) {
            this.logger.error(error);
            /*
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error,
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: new Error(error)
            });
            */
            //throw new InternalServerErrorException(error)
        }

    }

    async onApplicationBootstrap() {
        /*
        try {
          const data = await this.entityGenService.getEntityData();
          this.logger.warn(JSON.stringify(data, null, 4), 'entities');
          //
          setTimeout(() => this.wss.emit('entities', data), 750);
          //this.wss.emit('entities', data)
        } catch (error) {
          this.logger.error(error)
          throw new InternalServerErrorException(error)
        }
        */
    }

    async afterInit(server: Server) {

    }

    async handleConnection(client: Socket, ...args: any[]) {

        /*
        try {
          const data = await this.entityGenService.getEntityData();
          this.logger.warn(JSON.stringify(data, null, 4), 'entities');
    
          setTimeout(() => this.wss.emit('entities', data), 750);
        } catch (error) {
          this.logger.error(error)
          throw new InternalServerErrorException(error)
        }
        this.logger.log('Initialized!');
        */
    }

    @SubscribeMessage('entities')
    async handleEntitiesMessage(client: any) {
    
        const data = await this.entityGenService.getEntityData();
        this.logger.log('entities', JSON.stringify(data, null, 4))
        throw new WsException('xxxxxxxxxx')
        this.wss.emit('entities', data);
      
    }




    @SubscribeMessage('view')
    async handleMessage(client: any, entity: string) {
        this.logger.warn("@SubscribeMessage('view')")
        this.logger.warn(entity, 'entity')
        const entityDataForView = await this.entityGenService.getEntityDataForView(entity);
        this.logger.warn(JSON.stringify(entityDataForView, null, 4), 'entityDataForView')
        this.wss.emit('viewdata', entityDataForView);
    }

    @SubscribeMessage('delete')
    async deleteEntity(client: any, entityName: string): Promise<void> {
        this.entityGenService.deleteEntity(entityName);

        const data = await this.entityGenService.getEntityData();
        this.logger.warn(JSON.stringify(data, null, 4), 'entities');
        //
        this.wss.emit('entities', data);


    }
}
