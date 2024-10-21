import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.orm.entity';

@Entity('Tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  Token_uuid: string;

  @Column()
  Jwt_uuid: string;

  @Column()
  Issued_at: Date;

  @Column()
  Revoked_at: Date | null;

  @Column()
  Expired_at: Date;

  @ManyToOne(() => User, (user) => user.Tokens)
  User: User;
}
