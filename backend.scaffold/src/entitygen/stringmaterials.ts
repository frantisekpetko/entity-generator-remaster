import { Column, Data } from './data.dto';

interface Datatypes {
  [type: string]: (additionalProperties: string) => {
    column: string;
    type: string;
  };
}

export const datatypes: Datatypes = {
  varchar: (additionalProperties) => ({
    column: `{
   type: "varchar",   ${additionalProperties}
  }`,
    type: 'string',
  }),
  text: (additionalProperties) => ({
    column: `{
   type: "text",   ${additionalProperties}
  }`,
    type: 'string',
  }),
  integer: (additionalProperties) => ({
    column: `{
   type: "int",   ${additionalProperties}
  }`,
    type: 'number',
  }),
  blob: (additionalProperties) => ({
    column: `{
   type: "blob",   ${additionalProperties}
  }`,
    type: 'Blob',
  }),
  double: (additionalProperties) => ({
    column: `{
   type: "double",   ${additionalProperties}
  }`,
    type: 'number',
  }),
  boolean: (additionalProperties) => ({
    column: `{
   type: "boolean",   ${additionalProperties}
  }`,
    type: 'boolean',
  }),
  date: (additionalProperties) => ({
    column: `{
   type: "date",   ${additionalProperties}
  }`,
    type: 'string',
  }),
  datetime: (additionalProperties) => ({
    column: `{
   type: "datetime",   ${additionalProperties}
  }`,
    type: 'string',
  }),
};


export const relationshipString = (
  rel: string
): string =>
 `@${rel}

`;

export const columnString = (
  item: Column,
  datatypes: Datatypes,
  additionalProperties: string,
): string =>
  `${item.index ? '\n  @Index()' : ''}
  @Column(${datatypes[item.datatype](additionalProperties).column})
  ${item.nameOfColumn}${!item.notNull ? '!' : ''}: ${
    datatypes[item.datatype](additionalProperties).type
  };
`;

export function getStringEntity(
  imports: string,
  model: string,
  Model: string,
  columns: string,
  relationships: string
): string {
  const entity = `
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
${imports}

@Entity({ name: '${model}' })
export class ${Model} extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  ${columns}
  ${relationships}
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
`;
  return entity;
}


