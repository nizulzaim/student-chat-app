import { MasterEntity } from '@libs/databases/master.entity';
import { Collection } from '@libs/decorators';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Collection('faculties')
export class Faculty extends MasterEntity {
  @Field()
  readonly name: string;

  @Field()
  readonly slug: string;
}
