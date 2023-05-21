import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginWithPasswordInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
