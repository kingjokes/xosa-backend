// import { ObjectId } from "mongodb";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
} from "typeorm";
@Entity()
export class Admin {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
