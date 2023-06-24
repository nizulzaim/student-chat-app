import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { SemestersResolver } from './semesters.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [SemestersService, SemestersResolver],
  exports: [SemestersService],
})
export class SemestersModule {}
