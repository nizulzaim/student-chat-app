import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { ConversationType } from '../entities/conversation.entity';

@InputType()
export class CreateConversationInput {
  @Field(() => [ID])
  userIds: ObjectId[];

  @Field(() => ConversationType)
  type: ConversationType = ConversationType.private;
}

@InputType()
export class UpdateConversationInput extends PartialType(
  CreateConversationInput,
) {
  @Field(() => ID)
  _id: ObjectId;
}
