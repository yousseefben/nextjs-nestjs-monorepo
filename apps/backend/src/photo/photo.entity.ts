import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsString, IsUrl } from 'class-validator';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { Client } from '@backend/client/client.entity';

@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  name: string;

  @Column({ nullable: false })
  @IsUrl()
  url: string;

  @ManyToOne(() => Client, (client) => client.photos)
  client: Client;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
