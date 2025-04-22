import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Author } from 'src/authors/author.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity("posts")
export class Post {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, {description: 'Название поста', nullable: false})
  @Column()
  title: string;

  @Field(() => String, {description: 'Содержание поста', nullable: true})
  @Column({nullable: true})
  content?: string;

  @Field(() => Author, {nullable: false, description: 'Автор поста'})
  @ManyToOne(() => Author, (author) => author.posts, {nullable: false, onDelete: 'CASCADE'})
  author: Author;
}
