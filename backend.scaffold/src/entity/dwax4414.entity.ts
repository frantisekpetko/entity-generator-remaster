
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';


@Entity({ name: 'dwax4414' })
export class Dwax4414 extends BaseEntity { 
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
