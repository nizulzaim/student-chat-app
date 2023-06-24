import { SortEnum } from '@libs/commons';
import {
  NonPaginationArgs,
  PaginationArgs,
} from '@libs/commons/types/paginated-input';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindOneSemesterClassInput {
  @Field({ nullable: true })
  readonly _id?: ObjectId;

  @Field({ nullable: true })
  readonly conversationId: ObjectId;
}

@InputType()
export class FindAllRawSemesterClassesInput extends NonPaginationArgs {
  @Field(() => Boolean, { nullable: true })
  readonly isActive?: boolean;
}

@InputType()
export class FindAllSemesterClassesInput extends IntersectionType(
  FindAllRawSemesterClassesInput,
  PaginationArgs,
) {}

@InputType()
export class SemesterClassesSortArgs {
  @Field(() => SortEnum, { nullable: true })
  readonly updatedAt?: string;
}
