import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Resolver()
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => [User])
  users() {
    return this.userService.users();
  }

  @Query(() => [User])
  async user() {
    return (await this.userService.users())[0];
  }
}
