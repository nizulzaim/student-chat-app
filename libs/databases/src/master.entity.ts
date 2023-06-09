import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@ObjectType({ isAbstract: true })
export class MasterEntity {
  private static _tableName = '';

  static getTableName() {
    return this._tableName;
  }

  @Field(() => ObjectId)
  readonly _id: ObjectId;

  @Field({ defaultValue: true })
  readonly isActive: boolean;

  @Field()
  readonly createdAt: Date = new Date();

  @Field()
  readonly updatedAt: Date = new Date();

  @Field()
  readonly isDeleted: boolean;

  @Field(() => ObjectId)
  readonly createdById: ObjectId;

  @Field(() => ObjectId)
  readonly updatedById: ObjectId;
}
