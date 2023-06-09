import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';

export enum UserType {
  ADMIN = 'ADMIN',
  LECTURER = 'LECTURER',
  STUDENT = 'STUDENT',
}

@ObjectType()
@Collection('users')
export class User extends MasterEntity {
  @Field()
  readonly firstName: string;

  @Field()
  readonly lastName: string;

  @Field()
  readonly email: string;

  @Field({ defaultValue: UserType.STUDENT })
  readonly type: UserType = UserType.STUDENT;

  readonly password: string;

  @Field({ defaultValue: 'Asia/Kuala_Lumpur' })
  readonly timezone: string = 'Asia/Kuala_Lumpur';
}
