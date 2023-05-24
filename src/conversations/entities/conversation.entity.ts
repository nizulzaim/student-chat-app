import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

export enum ConversationType {
  private = 'private',
  group = 'group',
}

@ObjectType()
@Collection('conversations')
export class Conversation extends MasterEntity {
  @Field(() => [ID])
  userIds: ObjectId[];

  @Field(() => ConversationType)
  type: ConversationType = ConversationType.private;
}
