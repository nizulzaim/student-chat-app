import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPaginatedType<T> {
  hasPreviousPage: boolean;
  items: T[];
  count: number;
  page: number;
  hasNextPage: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], { nullable: true })
    items: T[];

    @Field(() => Int)
    count: number;

    @Field(() => Int)
    page: number;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
