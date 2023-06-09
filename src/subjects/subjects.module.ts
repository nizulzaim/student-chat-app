import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { UsersModule } from 'src/users/users.module';
import { SubjectsResolver } from './subjects.resolver';
import { FacultiesModule } from 'src/faculties/faculties.module';

@Module({
  imports: [UsersModule, FacultiesModule],
  providers: [SubjectsService, SubjectsResolver],
})
export class SubjectsModule {}
