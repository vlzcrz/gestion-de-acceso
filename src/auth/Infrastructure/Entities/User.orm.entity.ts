import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from './Token.orm.entity';

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
  CareerId: number;

  @Column()
  HashedPassword: string;

  @Column()
  Role: string;

  @OneToMany(() => Token, (token) => token.User)
  Tokens: Token[];
}
