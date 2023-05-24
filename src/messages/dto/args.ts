import { NonPaginationArgs, PaginationArgs, SortEnum } from '@libs/commons';
import { Field, ID, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindAllRawMessagesInput extends NonPaginationArgs {
  @Field(() => ID, { nullable: true })
  userIds: ObjectId;
}

@InputType()
export class FindAllMessagesInput extends IntersectionType(
  FindAllRawMessagesInput,
  PaginationArgs,
) {
  @Field(() => ID, { nullable: true })
  conversationId: ObjectId;
}

@InputType()
export class MessagesSortArgs {
  @Field(() => SortEnum, { nullable: true })
  updatedAt?: string;

  @Field(() => SortEnum, { nullable: true })
  firstName?: string;

  @Field(() => SortEnum, { nullable: true })
  lastName?: string;

  @Field(() => SortEnum, { nullable: true })
  email?: string;
}
