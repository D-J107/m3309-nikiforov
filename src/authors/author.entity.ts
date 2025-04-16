import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity("authors")
export class Author {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({description: 'Имя автора'})
  @Column()
  name: string;

  @Field(() => [Post], {nullable: true})
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
