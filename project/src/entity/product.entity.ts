
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, ManyToMany, JoinTable, ManyToOne, OneToMany} from 'typeorm'
import {Order} from './order.entity';
import {Category} from './category.entity';
import {Image} from './image.entity';


@Entity({ name: 'product' })
export class Product extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  name: string;
  @Column({
   type: "int",   
  })
  title: number;
  @Column({
   type: "int",   
  })
  description: number;
  @Column({
   type: "int",   
  })
  stockQuantity: number;
  @Column({
   type: "int",   
  })
  price: number;
  @Column({
   type: "int",   
  })
  priceVat: number;
  @Column({
   type: "int",   
  })
  vat: number;
  @Column({
   type: "int",   
  })
  discount: number;
  @Column({
   type: "int",   
  })
  adminId: number;
  @Column({
   type: "int",   
  })
  categoryId: number;
  
  @JoinTable()                        
  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];


  @ManyToOne(() => Category, (category) => category.products)
  category: Category;


  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
