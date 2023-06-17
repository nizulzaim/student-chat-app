import { Field, ObjectType } from '@nestjs/graphql';
import { Collection } from '@libs/decorators';
import { MasterEntity } from '@libs/databases/master.entity';

@ObjectType()
@Collection('attachments')
export class Attachment extends MasterEntity {
  @Field()
  filename: string;

  @Field()
  key: string;

  @Field()
  mimeType: string;

  @Field()
  size: number;

  @Field({ defaultValue: false })
  isPublic?: boolean;
}
