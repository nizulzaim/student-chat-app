import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Collection('semesters')
export class Semester extends MasterEntity {
  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}
