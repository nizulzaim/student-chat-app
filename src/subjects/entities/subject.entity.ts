import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
@Collection('subjects')
export class Subject extends MasterEntity {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  facultyId: ObjectId;
}
