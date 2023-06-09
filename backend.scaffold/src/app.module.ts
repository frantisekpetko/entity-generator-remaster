import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
//import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitygenModule } from './entitygen/entitygen.module';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { SharedModule } from './shared/shared.module';
import { AssistantModule } from './assistant/assistant.module';
import { SocketsModule } from './sockets/sockets.module';
import { typeOrmConfig } from './config/typeorm.config';




@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/.env`,
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: process.env.NODE_ENV === 'development' ? `../${process.env.PROJECT_URL}${process.env.DATABASE_URL}` : `../${process.env.PROJECT_URL}${process.env.DATABASE_URL}`,
            logging: true,
            autoLoadEntities: true,
            synchronize: true,
            //entities: ["src/entity/**/*.ts"],
            entities: ["dist/**/*.entity.js"],
            migrations: ["src/migration/**/*.ts"],
            subscribers: ["src/subscriber/**/*.ts"]
        }),
        EntitygenModule,
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        nestWinstonModuleUtilities.format.nestLike('MyApp', {
                            // options
                        }),
                    ),
                }),
                new winston.transports.File({ filename: './errors.log' })
                // other transports...
            ],
        }),
        SharedModule,
        AssistantModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
