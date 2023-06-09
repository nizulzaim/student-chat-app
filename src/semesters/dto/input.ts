import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InputType()
export class CreateSemesterInput {
  @Field()
  readonly name: string;

  @Field()
  readonly startDate: Date;

  @Field()
  readonly endDate: Date;

  @Field({ defaultValue: true, nullable: true })
  readonly isActive: boolean;
}

@InputType()
export class UpdateSemesterInput extends PartialType(CreateSemesterInput) {
  @Field()
  _id: ObjectId;
}
