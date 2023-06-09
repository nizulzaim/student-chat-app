import { SortEnum } from '@libs/commons';
import {
  NonPaginationArgs,
  PaginationArgs,
} from '@libs/commons/types/paginated-input';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindOneSubjectInput {
  @Field({ nullable: true })
  _id?: ObjectId;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class FindAllRawSubjectsInput extends NonPaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class FindAllSubjectsInput extends IntersectionType(
  FindAllRawSubjectsInput,
  PaginationArgs,
) {}

@InputType()
export class SubjectsSortArgs {
  @Field(() => SortEnum, { nullable: true })
  updatedAt?: string;

  @Field(() => SortEnum, { nullable: true })
  code?: string;

  @Field(() => SortEnum, { nullable: true })
  name?: string;
}
