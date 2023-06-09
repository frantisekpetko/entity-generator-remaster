import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
    const logger = new Logger(AppService.name);
    logger.log(process.env.PROJECT_URL)
    logger.debug(process.env.NODE_ENV)
  }
}
