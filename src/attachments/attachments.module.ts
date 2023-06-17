import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsResolver } from './attachments.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AttachmentsService, AttachmentsResolver],
  exports: [AttachmentsService]
})
export class AttachmentsModule {}
