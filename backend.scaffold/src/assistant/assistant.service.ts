import { EntitygenService } from './../entitygen/entitygen.service';
import { processProjectUrl, root } from './../config/paths';
import fs, { promises as fsPromises } from 'fs';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import path from 'path';
import { PathsService } from '../entitygen/paths/paths.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AssistantService {

    private logger: Logger = new Logger(AssistantService.name);

    constructor(private entitygenService: EntitygenService, private pathsService: PathsService, private dataSource: DataSource) { }

    async createAllEntities(data) {
        for (const schema of data) {
            await this.entitygenService.createEntityFile(schema);
            await this.entitygenService.finishGeneratingEntityFile();
        }
        await this.entitygenService.finishGeneratingEntityFile();
    }

    getSrcFiles(): Promise<string[]> {
        return fsPromises.readdir(`${processProjectUrl}/src/entity`);
    }

    async recreateDatabaseSchema() {
        //await this.persistDatabaseSchema();

        await this.removeTables();

        const schemaPath = path.join(this.pathsService.getProcessProjectUrl(), 'src/config/databaseSchema.json');

        if (fs.existsSync(schemaPath)) {
            const data = await fsPromises.readFile(path.join(this.pathsService.getProcessProjectUrl(), 'src/config/databaseSchema.json'), 'utf-8');

            const parsedData = JSON.parse(data);

            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            if (parsedData.length > 0 && Array.isArray(parsedData)) {
                this.createAllEntities(parsedData);
            }

            /*
            await Promise.all([
                this.createAllEntities(parsedData),
                timeout(2000),
            ])
            */
        }
        else {

            throw new InternalServerErrorException(
                `Database JSON schema doesn't exists! Please persist database schema first.`
            )
        }



    }

    async persistDatabaseSchema() {
        const entities = await this.getSrcFiles();
        //this.logger.debug(JSON.stringify(entities))
        let schemaArr: any[] = [];


        for (const entity of entities) {
            const entityName = entity.split('.')[0];
            this.logger.debug(entity, 'entity')
            let { data } = await this.entitygenService.getEntityDataForView(entityName);
            schemaArr.push(data)
        }

        this.logger.warn(JSON.stringify(schemaArr), 'Final schema')
        await fsPromises.writeFile(
            path.join(this.pathsService.getProcessProjectUrl(), 'src/config/databaseSchema.json'),
            JSON.stringify(schemaArr, null, 4),
            'utf8'
        );


    }

    async removeTables() {
        const conn = this.dataSource;
        const queryRunner = conn.createQueryRunner()

        // take a connection from the connection pool
        await queryRunner.connect();

        let distDir: string[] = [];
        let srcDir: string[] = [];

        async function getDistFiles() {
            if (fs.existsSync(`${root}/entity`)) {
                distDir = await fsPromises.readdir(`${root}/entity`)
            }
            else {
                distDir = [];
            }

        }

        const getSrcFiles = async () => {
            srcDir = await this.getSrcFiles();
        }

        await Promise.all([
            getDistFiles(),
            getSrcFiles()
        ]);

        try {
            const entities = conn.entityMetadatas;



            await queryRunner.release();

            async function removeDistFiles() {

                for (const file of distDir) {
                    await fsPromises.rm(`${root}/entity/${file}`)
                }


            }

            async function removeSrcFiles() {
                for (const file of srcDir) {
                    await fsPromises.rm(`${processProjectUrl}/src/entity/${file}`)
                }
            }

            await Promise.all([
                removeDistFiles(),
                removeSrcFiles()
            ])

            //const query = await conn.manager.query(`select name from sqlite_master where type = 'table'`);
            
            const query = await conn.manager.query(`SELECT * from sqlite_master`);
            //const count = ifTableExists[0][Object.keys(ifTableExists[0])[0]];
            this.logger.warn(JSON.stringify(query, null, 4), 'check');
            /*

            for (const entity of entities) {
                this.logger.log(JSON.stringify(entity.name, null, 4))
                await queryRunner.query(`DROP table ${entity.tableName}`)
            }
            */
            await queryRunner.query('PRAGMA foreign_keys = OFF')
            for (const entity of query) {
                this.logger.log(JSON.stringify(entity.name, null, 4))
                if (entity.name !== 'sqlite_sequence') {
                    //await queryRunner.query(`UNLOCK TABLE ${entity.tbl_name}`);
                    await queryRunner.query(`DROP table IF EXISTS ${entity.tbl_name}`);
                }
            }
            await queryRunner.query('PRAGMA foreign_keys = ON')



            return;
        }
        catch (err) {
            this.logger.error(JSON.stringify(err, null, 4))
            throw new BadRequestException(JSON.stringify(err, null, 4));
        }


    }


    async removeData() {
        const entities = this.dataSource.entityMetadatas;

        for (const entity of entities) {
            const repository = this.dataSource.getRepository(entity.name); // Get repository
            await repository.clear(); // Clear each entity table's content
        }
    }

    async getEntityMetadata() {
        const entities = this.dataSource.entityMetadatas;


        const schema = {
            varchar: 'character varying',
            datetime: 'timestamp without time zone',
            date: 'date',
            text: 'text',
            integer: 'integer',
            json: 'json',
            primaryKey: 'bigint',
            foreignKey: 'bigint',
            boolean: 'boolean',
            specialinteger: 'numeric'

        }

        let data = [];

        //let columnMap = {};
        for (let[index, entity] of entities.entries()) {
            const metadata = this.dataSource.getMetadata(entity.name); // Get repository
            let columnsData = [];
            let columns = [];
            columns = metadata.columns.map((column) => column.type);
            this.logger.log(JSON.stringify(columns, null, 4))
            let columnMap = metadata.columns.map((column) => column.propertyName);
            columns.forEach((item, i) => {
                this.logger.log(columns[i]);
                let type = typeof columns[i] !== 'function' ? columns[i] : 'bigint';
                columnsData.push({ name: columnMap[i], type: type })
            });
            //const columnMap = metadata.columns.map((column) => column.propertyName);
            //let columnMap = metadata.columns.map((column) => { name: column.propertyName, columnType: column.type });
            //columnsData.push({ name: columnMap, type: columns });
            data.push({ name: entity.tableName, data: columnsData })
            

            
        }

        return data;


    }
}
