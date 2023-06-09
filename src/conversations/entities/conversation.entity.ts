import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

export enum ConversationType {
  private = 'private',
  group = 'group',
}

@ObjectType()
export class UserMeta {
  @Field(() => [ObjectId])
  userId: ObjectId;

  @Field(() => Date)
  lastReadAt: Date;
}

@ObjectType()
@Collection('conversations')
export class Conversation extends MasterEntity {
  @Field(() => [ObjectId])
  userIds: ObjectId[];

  @Field(() => [UserMeta])
  usersMeta?: UserMeta[];

  @Field(() => ConversationType)
  type: ConversationType = ConversationType.private;

  @Field(() => Date, { nullable: true })
  lastMessageAt: Date;
}
