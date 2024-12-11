import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from './Token.orm.entity';
import { Career } from './Career.orm.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  User_uuid: string;

  @Column()
  Name: string;

  @Column()
  FirstLastName: string;

  @Column()
  SecondLastName: string;

  @Column()
  RUT: string;

  @Column()
  Email: string;

  @Column()
  HashedPassword: string;

  @Column()
  Role: string;

  @ManyToOne(() => Career, (career) => career.User, {
    cascade: true,
    eager: true,
  })
  Career: Career;

  @OneToMany(() => Token, (token) => token.User)
  Tokens: Token[];
}
