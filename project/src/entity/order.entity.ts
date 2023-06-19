
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, ManyToOne, ManyToMany, JoinTable} from 'typeorm'
import {Address} from './address.entity';
import {Customer} from './customer.entity';
import {Product} from './product.entity';


@Entity({ name: 'order' })
export class Order extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  mailTypeOrder: string;
  @Column({
   type: "varchar",   
  })
  transportType: string;
  @Column({
   type: "varchar",   
  })
  paymentType: string;
  @Column({
   type: "varchar",   
  })
  note: string;
  @Column({
   type: "int",   
  })
  customerId: number;
  @Column({
   type: "int",   
  })
  addressId: number;
  
  @ManyToOne(() => Address, (address) => address.orders)
  address: Address;


  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;


  @JoinTable()                        
  @ManyToMany(() => Product, (product) => product.orders)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
