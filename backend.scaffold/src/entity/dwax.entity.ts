
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';


@Entity({ name: 'dwax' })
export class Dwax extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
   nullable: true,
  })
  awd!: string;

  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
