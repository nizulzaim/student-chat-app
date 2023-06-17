import {
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { BaseResolver } from '@libs/commons';
import { WeekDocument } from './entities/week-attachment.entity';
import { Attachment } from 'src/attachments/entities/attachment.entity';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { ObjectId } from 'mongodb';

@Resolver(() => WeekDocument)
export class SubjectWeekDocumentsResolver extends BaseResolver(WeekDocument) {
  constructor(
    private readonly userService: UsersService,
    private readonly attachmentService: AttachmentsService,
  ) {
    super(userService);
  }

  @ResolveField(() => Attachment)
  attachmentInfo(@Parent() document: WeekDocument) {
    return this.attachmentService.getById(new ObjectId(document.attachmentId))
  }
}
