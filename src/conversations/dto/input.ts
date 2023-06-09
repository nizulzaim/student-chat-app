import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { ConversationType } from '../entities/conversation.entity';

@InputType()
export class CreateConversationInput {
  @Field(() => [ObjectId])
  userIds: ObjectId[];

  @Field(() => ConversationType)
  type: ConversationType = ConversationType.private;

  @Field(() => Date, { nullable: true })
  lastMessageAt?: Date;
}

@InputType()
export class UpdateConversationInput extends PartialType(
  CreateConversationInput,
) {
  @Field()
  _id: ObjectId;

  @Field({ nullable: true })
  userId?: ObjectId;
}
