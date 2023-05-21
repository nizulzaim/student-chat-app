import { Field, ID, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class FindOneUserInput {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;
}
