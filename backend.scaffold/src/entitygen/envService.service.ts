import { Injectable, InternalServerErrorException, HttpException, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import * as path from "path";
import fs from 'fs';

@Injectable()
export class EnvService {
    //processProjectUrl: string = path.resolve(__dirname, `../../../../../${process.env.PROJECT_URL}`);
    //processProjectUrl: string = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
    //root: string = `${this.processProjectUrl}/dist/src`;

    getProcessProjectUrl(): string | null {
        let processProjectUrl: string = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
        console.warn({ processProjectUrl }, fs.existsSync(processProjectUrl))
        if (fs.existsSync(processProjectUrl)) {
            console.warn('fs.existsSync')
            return processProjectUrl;
        }
        else {
            console.warn('daadwwad')
            if (fs.existsSync('../../..')) {
                process.env.PROJECT_URL = '../../..';
                processProjectUrl = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
                return processProjectUrl;

            }
            else {
                throw new ServiceUnavailableException(
                    `Project path ${processProjectUrl} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
                    {
                        cause: new Error(), description: `Project path ${processProjectUrl} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
                    }
                );
            }

        }
    }

    getRootUrl(): string | null {
        let processProjectUrl: string = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
        let root: string = `${processProjectUrl}/dist/src`;
        if (fs.existsSync(root)) {
            return root;
        }
        else {
            /*
            if (fs.existsSync('../../..')) {
                process.env.PROJECT_URL = '../../..';
                processProjectUrl = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
                root = `${processProjectUrl}/dist/src`;
                return root;

            }
            */
            return null;
            /*
            throw new ServiceUnavailableException(
                `Project dist root path ${root} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
                {
                    cause: new Error(), description: `Project dist root path ${root} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
                }
            );
            */
        }
    }
}