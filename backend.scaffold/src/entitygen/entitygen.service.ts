import { EnvService } from './envService.service';
//import { root, processProjectUrl } from './../config/paths';
import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { datatypes, getStringEntity, columnString, getFromBetween } from './stringmaterials';
import { capitalizeFirstLetter, getObjectBetweenParentheses } from 'src/utils/string.functions';
//import { getConnection } from 'typeorm';
import { Data, Column, Relationship } from './data.dto';
import {promises as fsPromises} from 'fs';
import fs from 'fs';
import { DataSource } from 'typeorm';


type FormColumn = {
    nameOfColumn: string,
    datatype: string,
    notNull: boolean,
    unique: boolean,
    index: boolean,
}

type FormRelationship = {
    type: string,
    table: string
}

type FormState = {
    name?: string,
    columns?: FormColumn[],
    relationships?: FormRelationship[],
}

@Injectable()
export class EntitygenService implements OnModuleInit {
    private logger = new Logger(EntitygenService.name);
    //private projectUrl = this.envService.getProcessProjectUrl();
    //private rootUrl = this.envService.getRootUrl();
    

    constructor(private envService: EnvService, private dataSource: DataSource) {}

    onModuleInit() {
        //this.logger.log(this.envService.getProcessProjectUrl(), 'log')
    }

    private isAllowedRelationshipCreating: boolean = true;

    async getEntityDataForView(entityName: string): Promise<{data: Data}> {
        const projectUrl = this.envService.getProcessProjectUrl();
        //const rootUrl = this.envService.getRootUrl();


        enum RelationshipType {
            'ONE_TO_ONE' = 'OneToOne',
            'ONE_TO_MANY' = 'OneToMany',
            'MANY_TO_ONE' = 'ManyToOne',
            'MANY_TO_MANY' = 'ManyToMany'
        }

        let data: Data = {
            name: '',
            columns: [],
            relationships: []
        };

        const txt = await fsPromises.readFile(`${projectUrl}/src/entity/${entityName}.entity.ts`, 'utf8');
        const txtWithoutWhiteSpace = txt.replace(/ /g, '').replace(/\n/g, '');
        this.logger.log(txtWithoutWhiteSpace, 'txt');
        const txtArray = txtWithoutWhiteSpace.split(';').map(item => item + ';')
        const columnTxtArray = txtArray.filter(item => item.startsWith('@Index') || item.startsWith('@Column'));
        this.logger.log(JSON.stringify(columnTxtArray, null, 4), 'txtArray');
        const relTxtArray = txtArray
        .filter(item => 
            item.startsWith(`@${RelationshipType.ONE_TO_ONE}`) ||
            item.startsWith(`@${RelationshipType.ONE_TO_MANY}`) ||
            item.startsWith(`@${RelationshipType.MANY_TO_ONE}`) ||
            item.startsWith(`@${RelationshipType.MANY_TO_MANY}`) ||
            item.startsWith(`@JoinColumn`) ||
            item.startsWith(`@JoinTable`)
        
        )
        const tableName: string = getFromBetween.get(txtWithoutWhiteSpace, "@Entity({name:", "})");

        data.name = tableName[0].replace(/'/g, '');



        const columnData = getFromBetween.get(txtWithoutWhiteSpace, "@Column({", "})");
        //const parsedColumnData = JSON.parse(JSON.stringify(columnData));

        let columns: FormColumn[] = [];
        let relationships:FormRelationship[] = [];

        //let entireColumnData = getFromBetween.get(txtWithoutWhiteSpace, "@Column({", "@");
        let entireColumnData = getFromBetween.get(txtWithoutWhiteSpace, "@Column({", ";@");
        //this.logger.log(txtWithoutWhiteSpace, 'txt')



        columnTxtArray.forEach((element) => {

            let isUnique = getFromBetween.get(element + ':', 'unique:', ':');
            //this.logger.log(element, 'element')
            isUnique = isUnique.length < 1 ? false : Boolean(isUnique);
            let datatype = getFromBetween.get(element, 'type:"', '"')[0];
            //this.logger.warn(getFromBetween.get(element, 'type:"', '"'), 'datatype');
            let notNull = getFromBetween.get(element + ':', 'nullable:', ':');
            notNull = notNull.length < 1 ? false : Boolean(isUnique);


            let columnName = getFromBetween.get(element, "})", ";")[0].split(':')[0];


            if (columnName.charAt(columnName.length - 1) === '!') {
                columnName = columnName.substring(0, columnName.length - 1);
            }

            const isIndex = element.startsWith('@Index()');
            //this.logger.debug(columnName, 'columnName')
            /*
          */

            columns.push({
                nameOfColumn: columnName,
                notNull: notNull,
                unique: isUnique,
                index: isIndex,
                datatype: datatype
            })
            this.logger.log('##################');

    

        });


        this.logger.warn(relTxtArray, 'relTxtArray') 
        relTxtArray.forEach(element => {

            const relType = getFromBetween.get(element, '@', '(()=>');
            const entity = (getFromBetween.get(element, '(()=>', ',') + '').toLowerCase();

            relationships.push({
                type: relType,
                table: (entity + '')
            })
            this.logger.debug(relType, 'relType')
            this.logger.debug(entity, 'entity');
        })


        //entireColumnData = getFromBetween.get(entireColumnData, ')', ';')
        //this.logger.warn(getFromBetween.get(entireColumnData[0], "})", ";")[0].split(':'));
        this.logger.debug(JSON.parse(JSON.stringify(entireColumnData))[0]);
        this.logger.log(JSON.stringify(columns));
        data.columns = [...columns];
        data.relationships = [...relationships, {
            type: 'OneToOne',
            table: ''
        }];

        return { data: data };


    }

    async createEntityFile(data: Data): Promise<{ data: string }> { 
        const projectUrl = this.envService.getProcessProjectUrl();
        const conn = this.dataSource.createQueryRunner();
        try {

            //const conn = getConnection();
     

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
                        if (this.isAllowedRelationshipCreating) {
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
                            data.relationships = [...data.relationships, { table: model, type: RelationshipType.MANY_TO_MANY }];
                            this.logger.warn(this.isAllowedRelationshipCreating);
                            this.createEntityFile(data).then(() => {
                                this.isAllowedRelationshipCreating = false
                            });

                        }

                        //  add to imports JoinTable, ManyToMany 
                        //  change relationship at second entity without JoinTable, 
                        //      if there is another JoinTable, drop it
                    }



                }

            });



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


            const content = getStringEntity(imports, model, Model, cols.join(''), relationships, entityImports);


            this.logger.debug(content, data.name);


            if (data.isEditedEntity && data.originalEntityName !== '') {
                await Promise.all([
                    fsPromises.rename(`${projectUrl}/src/entity/${data.originalEntityName}.entity.ts`, `./src/entity/${model}.entity.ts`),
                    conn.query(`DROP TABLE '${data.originalEntityName}'`)
                ]);

            }

            await fsPromises.writeFile(
                `${projectUrl}/src/entity/${model}.entity.ts`,
                content,
                'utf8',
            );

            return { data: content };
        } catch (e: any) {
            this.logger.error(e?.stack);
        }
        finally {
            await conn.release();
        }
    }


    async getEntityData(): Promise<{ entityName: string, filename: string, table: string }[]> {
        const projectUrl = this.envService.getProcessProjectUrl();
        const rootUrl = this.envService.getRootUrl();


        let items: { entityName: string, filename: string, table: string }[] = [];
        let checkIfDuplicateItems: string[] = [];

        this.logger.warn('if exists rooturl with entities ' + fs.existsSync(`${rootUrl}/entity`));
        
        if (fs.existsSync(`${rootUrl}/entity`)) {

            const distEntityFiles: string[] = fs.readdirSync(`${rootUrl}/entity`);

            distEntityFiles.forEach((file, i) => {
                const table = file.split('.')[0];
                const entityName = capitalizeFirstLetter(table);
                const fileName = `${table}.entity.ts`;

                if (checkIfDuplicateItems.indexOf(entityName) === -1) {
                    items.push({ entityName: entityName, filename: fileName, table: table });
                    checkIfDuplicateItems.push(entityName);
                }
            });
        }
        else {
            
            const srcEntityFiles: string[] = fs.readdirSync(`${projectUrl}/src/entity`);

            if (srcEntityFiles.length > 0) {
                srcEntityFiles.forEach((file, i) => {
                    const table = file.split('.')[0];
                    const entityName = capitalizeFirstLetter(table);
                    const fileName = `${table}.entity.ts`;

                    if (checkIfDuplicateItems.indexOf(entityName) === -1) {
                        items.push({ entityName: entityName, filename: fileName, table: table });
                        checkIfDuplicateItems.push(entityName);
                    }
                });
            }
        }


        return items;
    }

    async deleteEntity(entityName: string): Promise<void> {
        //const fileToDelete = entityName.split('.')[0];
        const projectUrl = this.envService.getProcessProjectUrl();
        const rootUrl = this.envService.getRootUrl();
        const conn = this.dataSource.createQueryRunner();
        try {
            const fileToDelete = entityName.split('.')[0];

            if (fs.existsSync(rootUrl)) {
                const distEntityFiles: string[] = fs.readdirSync(`${rootUrl}/entity`);

                if (distEntityFiles.length > 0) {
                    distEntityFiles.forEach(async (file, i) => {

                        const table = file.split('.')[0];


                        this.logger.warn(entityName, fs.existsSync(`${projectUrl}/src/entity/${entityName}`) + '');
                        if (table === fileToDelete) {

                            await fsPromises.unlink(`${rootUrl}/entity/${file}`)


                        }

                    });
                }
            }


            if (fs.existsSync(`${projectUrl}/src/entity/${entityName}`)) {
                await fsPromises.unlink(`${projectUrl}/src/entity/${entityName}`);
                await conn.query(`DROP TABLE '${fileToDelete}'`)
            }


            //const data = await this.getEntityData();
            //this.gateway.wss.emit('entities', data);
            //this.entitygenGateway.wss.emit('entities', data);
        }
        catch (e: any) {
            this.logger.error(e?.stack);
        }
        finally {
            await conn.release();
        }



    }




}
