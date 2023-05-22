import { SortEnum } from '@libs/commons';
import {
  NonPaginationArgs,
  PaginationArgs,
} from '@libs/commons/types/paginated-input';
import { Field, ID, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindOneUserInput {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field({ nullable: true })
  email?: string;
}

@InputType()
export class FindAllRawUsersInput extends NonPaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class FindAllUsersInput extends IntersectionType(
  FindAllRawUsersInput,
  PaginationArgs,
) {}

@InputType()
export class UsersSortArgs {
  @Field(() => SortEnum, { nullable: true })
  updatedAt?: string;

  @Field(() => SortEnum, { nullable: true })
  firstName?: string;

  @Field(() => SortEnum, { nullable: true })
  lastName?: string;

  @Field(() => SortEnum, { nullable: true })
  email?: string;
}
