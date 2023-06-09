import { SortEnum } from '@libs/commons';
import {
  NonPaginationArgs,
  PaginationArgs,
} from '@libs/commons/types/paginated-input';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindOneSemesterInput {
  @Field({ nullable: true })
  _id?: ObjectId;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class FindAllRawSemestersInput extends NonPaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class FindAllSemestersInput extends IntersectionType(
  FindAllRawSemestersInput,
  PaginationArgs,
) {}

@InputType()
export class SemestersSortArgs {
  @Field(() => SortEnum, { nullable: true })
  updatedAt?: string;

  @Field(() => SortEnum, { nullable: true })
  code?: string;

  @Field(() => SortEnum, { nullable: true })
  name?: string;
}
