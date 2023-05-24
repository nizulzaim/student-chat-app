//  FindAllConversations based on the UserId
//  FindOneConversation based on the ConversationId

import { NonPaginationArgs, PaginationArgs, SortEnum } from '@libs/commons';
import { Field, ID, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindOneConversationInput {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;
}

@InputType()
export class FindAllRawConversationsInput extends NonPaginationArgs {
  @Field(() => ID, { nullable: true })
  userIds: ObjectId;
}

@InputType()
export class FindAllConversationsInput extends IntersectionType(
  FindAllRawConversationsInput,
  PaginationArgs,
) {}

@InputType()
export class ConversationsSortArgs {
  @Field(() => SortEnum, { nullable: true })
  updatedAt?: string;

  @Field(() => SortEnum, { nullable: true })
  firstName?: string;

  @Field(() => SortEnum, { nullable: true })
  lastName?: string;

  @Field(() => SortEnum, { nullable: true })
  email?: string;
}
