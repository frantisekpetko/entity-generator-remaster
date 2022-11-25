import { root } from './../config/paths';
import { Injectable, Logger } from '@nestjs/common';
import { datatypes, getStringEntity, columnString, getFromBetween } from './stringmaterials';
import { capitalizeFirstLetter, getObjectBetweenParentheses } from 'src/utils/string.functions';
import { promises as fsPromises } from 'fs';
import { QueryRunner } from "typeorm";
import { getConnection } from 'typeorm';
import { Data, Column, Relationship } from './data.dto';
import fs from 'fs';

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
export class EntitygenService {
    private logger = new Logger(EntitygenService.name);

    private isAllowedRelationshipCreating = true;

    async getEntityDataForView(entityName: string): Promise<{data: Data}> {

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

        const txt = await fsPromises.readFile(`./src/entity/${entityName}.entity.ts`, 'utf8');
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
        const parsedColumnData = JSON.parse(JSON.stringify(columnData));

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
        return {data: ''};
    }


    async getEntityData(): Promise<{ entityName: string, filename: string, table: string }[]> {
        
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

    async deleteEntity(entityName: string): Promise<void> {
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


}
