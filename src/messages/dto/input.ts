import { Field, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class CreateMessageInput {
  @Field()
  conversationId: ObjectId;

  @Field()
  text: string;
}
