import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { BaseResolver } from '@libs/commons';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userService.findAll();
  }
}
