import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class CreateFacultyInput {
  @Field()
  readonly name: string;

  @Field()
  readonly slug: string;

  @Field({ defaultValue: true, nullable: true })
  readonly isActive: boolean;
}

@InputType()
export class UpdateFacultyInput extends PartialType(CreateFacultyInput) {
  @Field(() => ID)
  _id: ObjectId;
}
