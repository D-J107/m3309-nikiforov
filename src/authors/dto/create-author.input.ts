import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthorInput {
  @Field({description: 'Имя автора', nullable:false})
  name: string;
}
