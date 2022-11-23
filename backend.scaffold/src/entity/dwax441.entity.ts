
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';


@Entity({ name: 'dwax441' })
export class Dwax441 extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  awd: string;

  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
