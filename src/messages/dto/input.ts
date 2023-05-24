import { Field, ID, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class CreateMessageInput {
  @Field(() => ID)
  conversationId: ObjectId;

  @Field()
  text: string;
}
