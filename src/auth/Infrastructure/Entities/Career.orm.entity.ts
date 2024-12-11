import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.orm.entity';

@Entity('Career')
export class Career {
  @PrimaryGeneratedColumn('increment')
  Career_id: number;

  @Column()
  Name: string;

  @OneToMany(() => User, (user) => user.Career)
  User: User[];
}
