import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsResolver } from './subjects.resolver';
import { FacultiesModule } from 'src/faculties/faculties.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, FacultiesModule],
  providers: [SubjectsService, SubjectsResolver],
})
export class SubjectsModule {}
