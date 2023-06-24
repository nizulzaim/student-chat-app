import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
@Collection('semesterClasses')
export class SemesterClass extends MasterEntity {
  @Field()
  readonly name: string;

  @Field()
  readonly subjectId: ObjectId;

  @Field()
  readonly lecturerId: ObjectId;

  @Field(() => [ObjectId])
  readonly studentsId: ObjectId[];

  @Field()
  readonly semesterId: ObjectId;

  @Field({ nullable: true })
  readonly conversationId?: ObjectId;
}
