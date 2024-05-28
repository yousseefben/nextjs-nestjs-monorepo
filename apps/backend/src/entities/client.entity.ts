import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  avatar: string;

  @Column('simple-array')
  photos: string[];

  @ManyToOne(() => User, (user) => user.clients)
  user: User;
}
