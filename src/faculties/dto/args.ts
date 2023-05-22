import { SortEnum } from '@libs/commons';
import {
  NonPaginationArgs,
  PaginationArgs,
} from '@libs/commons/types/paginated-input';
import { Field, ID, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindOneFacultyInput {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field({ nullable: true })
  slug?: string;
}

@InputType()
export class FindAllRawFacultiesInput extends NonPaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class FindAllFacultiesInput extends IntersectionType(
  FindAllRawFacultiesInput,
  PaginationArgs,
) {}

@InputType()
export class FacultiesSortArgs {
  @Field(() => SortEnum, { nullable: true })
  updatedAt?: string;

  @Field(() => SortEnum, { nullable: true })
  slug?: string;

  @Field(() => SortEnum, { nullable: true })
  name?: string;
}
