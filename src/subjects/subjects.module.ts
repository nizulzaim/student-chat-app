import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsResolver } from './subjects.resolver';
import { FacultiesModule } from 'src/faculties/faculties.module';
import { UsersModule } from 'src/users/users.module';
import { AttachmentsModule } from 'src/attachments/attachments.module';
import { SubjectWeekDocumentsResolver } from './subject-week-documents.resolver';

@Module({
  imports: [UsersModule, FacultiesModule, AttachmentsModule],
  providers: [SubjectsService, SubjectsResolver, SubjectWeekDocumentsResolver],
  exports: [SubjectsService],
})
export class SubjectsModule {}
