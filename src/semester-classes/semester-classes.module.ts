import { Module, forwardRef } from '@nestjs/common';
import { SemesterClassesResolver } from './semester-classes.resolver';
import { SemesterClassesService } from './semester-classes.service';
import { UsersModule } from 'src/users/users.module';
import { SemestersModule } from 'src/semesters/semesters.module';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [
    UsersModule,
    SemestersModule,
    SubjectsModule,
    forwardRef(() => ConversationsModule),
  ],
  providers: [SemesterClassesResolver, SemesterClassesService],
  exports: [SemesterClassesService],
})
export class SemesterClassesModule {}
