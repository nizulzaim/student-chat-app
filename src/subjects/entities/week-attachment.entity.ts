import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class WeekAttachment {
  @Field()
  name: string;

  @Field()
  attachmentId: ObjectId;

  @Field(() => Int)
  week: number;
}
