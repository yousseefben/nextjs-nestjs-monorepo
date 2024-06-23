import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  TableInheritance,
} from 'typeorm';
import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Photo } from '../photo/photo.entity';
import { BaseEntity } from 'typeorm/repository/BaseEntity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25, nullable: false })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  firstName: string;

  @Column({ length: 25, nullable: false })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  lastName: string;

  @Column({ nullable: false })
  @IsString()
  fullName: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Column({ nullable: true })
  @IsString()
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  generateFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
