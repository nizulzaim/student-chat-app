import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

export enum ConversationType {
  private = 'private',
  group = 'group',
}

@ObjectType()
export class UserMeta {
  @Field(() => [ID])
  userId: ObjectId;

  @Field(() => Date)
  lastReadAt: Date;
}

@ObjectType()
@Collection('conversations')
export class Conversation extends MasterEntity {
  @Field(() => [ID])
  userIds: ObjectId[];

  @Field(() => [UserMeta])
  usersMeta?: UserMeta[];

  @Field(() => ConversationType)
  type: ConversationType = ConversationType.private;

  @Field(() => Date, { nullable: true })
  lastMessageAt: Date;
}
