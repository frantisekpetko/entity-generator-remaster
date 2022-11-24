import { EntitygenService } from './entitygen.service';
import { Body, Post, Get, Controller, Logger, Param, Delete } from '@nestjs/common';
import { Data, Column, Relationship } from './data.dto';
import { promises as fsPromises } from 'fs';
import fse from 'fs-extra';
import fs from "fs";
import { root } from '../config/paths';
import { datatypes, getStringEntity, columnString, getFromBetween } from './stringmaterials';
import { capitalizeFirstLetter, getObjectBetweenParentheses } from 'src/utils/string.functions';
import { QueryRunner } from "typeorm";
import { getConnection } from 'typeorm';
import { table } from 'console';



@Controller('entitygen')
export class EntitygenController {
    private logger = new Logger(EntitygenController.name);
    private isAllowedRelationshipCreating: boolean = true;
    private tableOrderRound: number = 1;

    constructor(private entityGenService: EntitygenService) { }

    @Delete('/entity/:entityName')
    async deleteEntity(@Param('entityName') entityName, qR: QueryRunner) {
        //const fileToDelete = entityName.split('.')[0];
        const conn = getConnection();
        const fileToDelete = entityName.split('.')[0];



        (fs.readdirSync(`${root}/entity`)).forEach(async (file, i) => {

            const table = file.split('.')[0];


            this.logger.warn(entityName, fs.existsSync(`./src/entity/${entityName}`) + '');
            if (table === fileToDelete) {

                await fsPromises.unlink(`${root}/entity/${file}`)


            }

        });

        if (fs.existsSync(`${process.cwd()}/src/entity/${entityName}`)) {
            await fsPromises.unlink(`${process.cwd()}/src/entity/${entityName}`);
            await conn.createQueryRunner().query(`DROP TABLE '${fileToDelete}'`)
        }



    }

    @Get('/entity/:entityName')
    async getEntityDataForView(@Param('entityName') entityName): Promise<any> {
        /*
        const getFromBetween = {
            results: [],
            string: "",
            getFromBetween: function (sub1, sub2) {
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
                var SP = this.string.indexOf(sub1) + sub1.length;
                var string1 = this.string.substr(0, SP);
                var string2 = this.string.substr(SP);
                var TP = string1.length + string2.indexOf(sub2);
                return this.string.substring(SP, TP);
            },
            removeFromBetween: function (sub1, sub2) {
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
                var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
                this.string = this.string.replace(removal, "");
            },
            getAllResults: function (sub1, sub2) {
                // first check to see if we do have both substrings
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

                // find one result
                var result = this.getFromBetween(sub1, sub2);
                // push it to the results array
                this.results.push(result);
                // remove the most recently found one from the string
                this.removeFromBetween(sub1, sub2);

                // if there's more substrings
                if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
                    this.getAllResults(sub1, sub2);
                }
                else return;
            },
            get: function (string, sub1, sub2) {
                this.results = [];
                this.string = string;
                this.getAllResults(sub1, sub2);
                return this.results;
            }
        };
        */


        return this.entityGenService.getEntityDataForView(entityName);
    }


    @Get()
    async getEntityData() {
        let items: { entityName: string, filename: string, table: string }[] = [];
        let checkIfDuplicateItems: string[] = [];
        (fs.readdirSync(`${root}/entity`)).forEach((file, i) => {
            const table = file.split('.')[0];
            const entityName = capitalizeFirstLetter(table);
            const fileName = `${table}.entity.ts`;

            if (checkIfDuplicateItems.indexOf(entityName) === -1) {
                items.push({ entityName: entityName, filename: fileName, table: table });
                checkIfDuplicateItems.push(entityName);
            }
        });

        return items;
    }

    @Post()
    async createEntityFile(@Body() data: Data): Promise<{ data: string }> {
        //return this.createEntityFile(data);
        try {
            //this.logger.debug(`./backend.scaffold/templates/model.entity.stub`);
            const conn = getConnection();

            const model = data.name.toLowerCase();
            const Model = capitalizeFirstLetter(data.name);

            let importsArray = [];



            let cols: string[] = data.columns.map((item: Column) => {
                //const additionalProperties = `${!item.notNull ? 'nullable: true,' : ''}${item.unique ? '\nunique: true' : ''}`;
                const additionalProperties =
                    (!item.notNull ? '\n   nullable: true,' : '') +
                    (item.unique ? '\n   unique: true' : '');

                //const parameters = datatypes[item.datatype]() === 'number' ? datatypes[item.datatype]() : `${datatypes[item.datatype]()}`;
                this.logger.debug(item);
                const column = columnString(item, datatypes, additionalProperties);
                //imports = `${item.index ? `import {Index} from "typeorm";` : ''}`;

                if (!(importsArray.includes('Index')))
                    importsArray.push('Index')

                return column;
            });

            enum RelationshipType {
                'ONE_TO_ONE' = 'OneToOne',
                'ONE_TO_MANY' = 'OneToMany',
                'MANY_TO_ONE' = 'ManyToOne',
                'MANY_TO_MANY' = 'ManyToMany'
            }
            let relArray = [];

            let entityImportsArray = [];
            /*let _relationships: string[] = */

            
            data.relationships.forEach(async (item: Relationship, index) => {
                const tableName = data.relationships[index].table;
                if (tableName !== '') {

                    let rel = '';
                    const entity = capitalizeFirstLetter(item.table);
                    if (item.type === RelationshipType.ONE_TO_ONE) {
                        rel = `
  @JoinColumn()
  @${item.type}(() => ${entity})
  ${item.table}: ${entity};
`;
                        importsArray = [...importsArray, item.type, 'JoinColumn'];

                        relArray.push(rel);

                        entityImportsArray.push(entity);

                        //  add to imports OneToOne, JoinColumn
                    }

                    if (item.type === RelationshipType.ONE_TO_MANY) {
                        rel = `
  @${item.type}(() => ${entity}, (${item.table}) => ${item.table}.${model})
  ${item.table}s: ${entity}[];
`;
                        importsArray.push(item.type);
                        relArray.push(rel);
                        entityImportsArray.push(entity);
                        if (this.isAllowedRelationshipCreating){
                            const data: Data = (await this.getEntityDataForView(tableName)).data;
                            data.relationships = [...data.relationships, { table: model, type: RelationshipType.MANY_TO_ONE }];
                            this.createEntityFile(data).then(() => this.isAllowedRelationshipCreating = false);

                            
                        }
               
                        //  add to imports OneToMany
                        //  change relationship at second entity
                    }

                    if (item.type === RelationshipType.MANY_TO_ONE) {
                        rel = `
  @${item.type}(() => ${entity}, (${item.table}) => ${item.table}.${model}s)
  ${item.table}: ${entity};
`;
                        importsArray.push(item.type);
                        relArray.push(rel);
                        entityImportsArray.push(entity);
                        if (this.isAllowedRelationshipCreating) {
                            const data: Data = (await this.getEntityDataForView(tableName)).data;

                            data.relationships = [...data.relationships, { table: model, type: RelationshipType.ONE_TO_MANY }];
                            this.createEntityFile(data).then(() => this.isAllowedRelationshipCreating = false);
                     
                        }

                    
                    }
                    //  add to imports ManyToOne
                    //  change relationship at second entity

                    if (item.type === RelationshipType.MANY_TO_MANY) {
                        rel = `
  @JoinTable()                        
  @${item.type}(() => ${entity}, (${item.table}) => ${item.table}.${model}s)
  ${item.table}s: ${entity}[];
`;
                        importsArray = [...importsArray, item.type, 'JoinTable'];
                        relArray.push(rel);
                        entityImportsArray.push(entity);
                        if (this.isAllowedRelationshipCreating/*this.tableOrderRound < 2*/) {
                            const data: Data = (await this.getEntityDataForView(tableName)).data;
                            //data.relationships = [...data.relationships, { table: model, type: RelationshipType.MANY_TO_MANY }]
                            //data.relationships[0].table === ''
                                //? data.relationships = [{ table: model, type: RelationshipType.MANY_TO_MANY }]
                            data.relationships = [...data.relationships,{ table: model, type: RelationshipType.MANY_TO_MANY }];
                            this.logger.warn(this.isAllowedRelationshipCreating, `Round ${this.tableOrderRound}`);
                            this.createEntityFile(data).then(() => {
                                this.tableOrderRound++;
                                this.isAllowedRelationshipCreating = false
                            });
                   
                        }
                  
                        //  add to imports JoinTable, ManyToMany 
                        //  change relationship at second entity without JoinTable, 
                        //      if there is another JoinTable, drop it
                    }


                    //return rel;
                }

            });
            
            // content = content.replace(/{columns}/g, cols.join(''));

            let relationships: string = relArray.join('\n');
            //let relationships: string = '';

            let imports = '';
            if (importsArray.length > 0) imports = `import {${importsArray.join(', ')}} from 'typeorm'`;

            let entityImports = '';

            if (entityImportsArray.length > 0) {
                entityImportsArray.forEach(entity => {
                    const file = entity.toLowerCase();
                    entityImports += `import {${entity}} from './${file}.entity';\n`
                });
            }

            //content = content.replace(/{imports}/g, imports);
            const content = getStringEntity(imports, model, Model, cols.join(''), relationships, entityImports);
            //this.logger.debug(content, data.name)

            this.logger.debug(content, data.name);
            //this.logger.debug(this.tableOrderRound, 'tableOrderRound')
            /*
            if (data.originalEntityName !== '' && fs.existsSync(`./src/entity/${data.originalEntityName}.entity.ts`)) {
                await Promise.all([
                    fsPromises.rename(`./src/entity/${data.originalEntityName}.entity.ts`, `./src/entity/${model}.entity.ts`),
                    conn.createQueryRunner().query(`DROP TABLE '${data.originalEntityName}'`)
                ]);

            }
            */

            if (data.isEditedEntity && data.originalEntityName !== '') {
                await Promise.all([
                    fsPromises.rename(`./src/entity/${data.originalEntityName}.entity.ts`, `./src/entity/${model}.entity.ts`),
                    conn.createQueryRunner().query(`DROP TABLE '${data.originalEntityName}'`)
                ]);

            }

            await fsPromises.writeFile(
                `./src/entity/${model}.entity.ts`,
                content,
                'utf8',
            );

            return { data: content };
        } catch (e: any) {
            this.logger.error(e?.stack);
        }
    }
}