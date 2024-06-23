import { User } from '@backend/user/user.entity';
import { Entity, Column, OneToMany, BeforeInsert, ChildEntity } from 'typeorm';
import { IsOptional, IsUrl } from 'class-validator';
import { Photo } from '@backend/photo/photo.entity';

@ChildEntity()
export class Client extends User {
  @Column({ nullable: true })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @OneToMany(() => Photo, (photo) => photo.client, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  photos: Photo[];
}
