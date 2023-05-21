import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Collection('users')
export class User extends MasterEntity {
  @Field()
  readonly firstName: string;

  @Field()
  readonly lastName: string;

  @Field()
  readonly email: string;

  readonly password: string;
}
