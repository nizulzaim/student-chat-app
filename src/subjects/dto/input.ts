import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class CreateSubjectInput {
  @Field()
  readonly name: string;

  @Field()
  readonly code: string;

  @Field()
  readonly facultyId: ObjectId;

  @Field({ defaultValue: true, nullable: true })
  readonly isActive: boolean;
}

@InputType()
export class UpdateSubjectInput extends PartialType(CreateSubjectInput) {
  @Field()
  _id: ObjectId;
}
