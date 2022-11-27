import { EntitygenService } from './../entitygen/entitygen.service';
import { root } from './../config/paths';
import { promises as fsPromises } from 'fs';
import fs from "fs";
import { getConnection } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import path from 'path';

@Injectable()
export class AssistantService {

  private logger: Logger = new Logger(AssistantService.name);

  constructor(private entitygenService: EntitygenService) { }

  async createAllEntities(data) {
    for (const schema of data) {
      await this.entitygenService.createEntityFile(schema);
    }
  }

  getSrcFiles(): Promise<string[]> {
    return fsPromises.readdir(`${process.cwd()}/src/entity`);
  }

  async recreateDatabaseSchema() {
    await this.persistDatabaseSchema();

    await this.removeTables();

    const data = await fsPromises.readFile(path.join(process.cwd(), 'src/config/databaseSchema.json'), 'utf-8');
    const parsedData = JSON.parse(data);

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    await Promise.all([
      this.createAllEntities(parsedData),
      timeout(2000),
    ])

  }

  async persistDatabaseSchema() {
    const entities = await this.getSrcFiles();
    //this.logger.debug(JSON.stringify(entities))


    let schemaArr: any[] = [];


    for (const entity of entities) {
      const entityName = entity.split('.')[0];
      this.logger.debug(entity, 'entity')
      let {data} = await this.entitygenService.getEntityDataForView(entityName);
      schemaArr.push(data)
    }

    this.logger.warn(JSON.stringify(schemaArr), 'Final schema')
    await fsPromises.writeFile(
      path.join(process.cwd(), 'src/config/databaseSchema.json'),
      JSON.stringify(schemaArr, null, 4),
      'utf8'
    );


  }

  async removeTables() {
    const conn = getConnection();
    const queryRunner = conn.createQueryRunner()

    // take a connection from the connection pool
    await queryRunner.connect();

    let distDir: string[] = [];
    let srcDir: string[] = [];

    async function getDistFiles() {
      distDir = await fsPromises.readdir(`${root}/entity`)
    }

    const getSrcFiles = async () => {
      srcDir = await this.getSrcFiles();
    }

    await Promise.all([
      getDistFiles(),
      getSrcFiles()
    ]);

    const entities = conn.entityMetadatas;

    for (const entity of entities) {
      queryRunner.query(`DROP table ${entity.tableName}`)
    }

    await queryRunner.release();

    async function removeDistFiles() {
      for (const file of distDir) {
        await fsPromises.rm(`${root}/entity/${file}`)
      }
    }

    async function removeSrcFiles() {
      for (const file of srcDir) {
        await fsPromises.rm(`${process.cwd()}/src/entity/${file}`)
      }
    }

    await Promise.all([
      removeDistFiles(),
      removeSrcFiles()
    ])



    return;
  }


  async removeData() {
    const entities = getConnection().entityMetadatas;

    for (const entity of entities) {
      const repository = getConnection().getRepository(entity.name); // Get repository
      await repository.clear(); // Clear each entity table's content
    }
  }
}
