import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class CreateSemesterClassInput {
  @Field()
  readonly semesterId: ObjectId;

  @Field()
  readonly subjectId: ObjectId;

  @Field()
  readonly lecturerId: ObjectId;

  @Field()
  readonly isActive: boolean;

  @Field(() => [ObjectId])
  readonly studentsId: ObjectId[];
}

@InputType()
export class UpdateSemesterClassInput extends PartialType(
  CreateSemesterClassInput,
) {
  @Field()
  readonly _id: ObjectId;
}
