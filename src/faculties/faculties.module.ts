import { Module } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { FacultiesResolver } from './faculties.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [FacultiesService, FacultiesResolver],
  exports: [FacultiesService],
})
export class FacultiesModule {}
