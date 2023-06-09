import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { UsersModule } from 'src/users/users.module';
import { SubjectsResolver } from './subjects.resolver';

@Module({
  imports: [UsersModule],
  providers: [SubjectsService, SubjectsResolver],
})
export class SubjectsModule {}
