import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, {description: 'Название поста', nullable: false})
  title: string;

  @Field({nullable: true})
  content?: string;

  @Field(() => Int)
  authorId: number;
}
