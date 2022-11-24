
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, Index} from 'typeorm'


@Entity({ name: 'cupakabra' })
export class Cupakabra extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  awdwad: string;

  @Column({
   type: "varchar",   
  })
  name: string;

  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}