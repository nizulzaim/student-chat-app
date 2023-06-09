import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { registerEnumType } from '@nestjs/graphql';
import { UserType } from './entities/user.entity';

@Module({
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {
    registerEnumType(UserType, { name: 'UserType' });
  }
}
