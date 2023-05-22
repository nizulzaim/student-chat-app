import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class NonPaginationArgs {
  @Field({ nullable: true })
  readonly search: string = null;
}

@InputType({ isAbstract: true })
export class PaginationArgs extends NonPaginationArgs {
  @Field(() => Int, { nullable: true })
  readonly page: number = 1;

  @Field(() => Int, { nullable: true })
  readonly limit: number = 10;
}
