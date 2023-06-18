import {
  Args,
  Resolver,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { Attachment } from './entities/attachment.entity';
import { UsersService } from 'src/users/users.service';
import { AttachmentsService } from './attachments.service';
import { BaseResolver } from '@libs/commons';
import { GraphQLUpload } from 'graphql-upload';
import { FileUpload } from './interfaces/file-upload';

@Resolver(() => Attachment)
export class AttachmentsResolver extends BaseResolver(Attachment) {
  constructor(
    private readonly userService: UsersService,
    private readonly attachmentService: AttachmentsService,
  ) {
    super(userService);
  }

  @Mutation(() => Attachment)
  async uploadAttachment(
    @Args({ name: 'file', type: () => GraphQLUpload }) input: FileUpload,
  ) {
    return this.attachmentService.upload(input);
  }

  @Query(() => String, {nullable: true})
  async getSignedAttachmentUrl(@Args('id', {nullable: true}) id: string | null) {
    if (!id) return null;
    return this.attachmentService.getUrl(id);
  }

  @Mutation(() => String, {nullable: true})
  async downloadSignedAttachmentUrl(@Args('id', {nullable: true}) id: string | null) {
    if (!id) return null;
    return this.attachmentService.getUrl(id, { downloadable: true });
  }
}
