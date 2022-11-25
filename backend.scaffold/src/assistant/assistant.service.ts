import { root } from './../config/paths';
import {promises as fsPromises} from 'fs';
import fs from "fs";
import { getConnection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

@Injectable()
export class AssistantService {
  create(createAssistantDto: CreateAssistantDto) {
    return 'This action adds a new assistant';
  }

  findAll() {
    return `This action returns all assistant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assistant`;
  }

  update(id: number, updateAssistantDto: UpdateAssistantDto) {
    return `This action updates a #${id} assistant`;
  }

  async removeTables() {
    const conn = getConnection();
    const queryRunner = conn.createQueryRunner()

    // take a connection from the connection pool
    await queryRunner.connect();

    let distDir: string[] = [];
    let srcDir: string[]= [];

    async function getDistFiles() {
      distDir = await fsPromises.readdir(`${root}/entity`)
    }

    async function getSrcFiles() {
      srcDir = await fsPromises.readdir(`${process.cwd()}/src/entity`)
    }

    await Promise.all([
      getDistFiles(),
      getSrcFiles()
    ]);

    async function removeDistFiles() {
      distDir.forEach((file, i) => {
        fs.rmSync(`${root}/entity/${file}`)

      });
    }

    async function removeSrcFiles() {
      srcDir.forEach((file, i) => {
        fs.rmSync(`${process.cwd()}/src//entity/${file}`)

      });
    }

    await Promise.all([
      removeDistFiles(),
      removeSrcFiles()
    ])

    const entities = conn.entityMetadatas;

    for (const entity of entities) {
      queryRunner.query(`DROP table ${entity.tableName}`)
    }

    await queryRunner.release();

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
