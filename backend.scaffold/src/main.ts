import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import fse from 'fs-extra';
import { root } from './config/paths';
import { promises as fsPromises } from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import path from 'path';
async function bootstrap() {
  //fse.mkdirSync(`${rootx}/entity`, { recursive: true })
  //fse.mkdirSync(`${root}/data`, { recursive: true });
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const port = 3000;

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('/api');
  const logger = new Logger('main.ts');
  logger.log(`${root}/${process.env.DATABASE_URL}`);
  logger.log(process.env.DATABASE_USER);
  //logger.warn(await getAppPath())
  logger.warn(process.cwd())
  await app.listen(port, () => logger.log(`App is listening at http://localhost:${port}`));
}
bootstrap();
