import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { WeekDocument } from './week-attachment.entity';

@ObjectType()
@Collection('subjects')
export class Subject extends MasterEntity {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  facultyId: ObjectId;

  @Field(() => [WeekDocument], { nullable: true })
  weekAttachments?: [WeekDocument];
}
