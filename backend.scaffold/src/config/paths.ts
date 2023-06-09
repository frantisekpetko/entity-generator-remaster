import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import * as path from "path";
let x = '';

const logger = new Logger('paths.ts');
ConfigModule.envVariablesLoaded.then(() => {
    x = process.env.PROJECT_URL;
    logger.log(x, 'root')
});
logger.log(x, 'root')

export const processProjectUrl: string = path.resolve(__dirname, "../../../../project");
export const root: string = `${processProjectUrl}/dist/src`;

