import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  readonly firstName: string;

  @Field()
  readonly lastName: string;

  @Field()
  readonly email: string;

  @Field()
  readonly password: string;

  @Field({ defaultValue: true, nullable: true })
  readonly isActive: boolean;

  @Field({ defaultValue: 'Asia/Kuala_Lumpur', nullable: true })
  readonly timezone: string;
}
