import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UploadDto {
  @Field(() => GraphQLUpload)
  file: FileUpload;
}
