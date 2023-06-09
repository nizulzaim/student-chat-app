import { NonPaginationArgs, PaginationArgs, SortEnum } from '@libs/commons';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindAllRawMessagesInput extends NonPaginationArgs {
  @Field({ nullable: true })
  userIds: ObjectId;
}

@InputType()
export class FindAllMessagesInput extends IntersectionType(
  FindAllRawMessagesInput,
  PaginationArgs,
) {
  @Field({ nullable: true })
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
