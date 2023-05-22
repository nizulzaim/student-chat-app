import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { BaseResolver } from '@libs/commons';
import { UsersService } from './users.service';
import { PaginatedUsers } from './dto/outputs';
import { FindAllUsersInput, UsersSortArgs } from './dto/args';
import { CreateUserInput } from './dto/input';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }

  @Query(() => PaginatedUsers)
  users(
    @Args('query')
    query: FindAllUsersInput,
    @Args('sort', { nullable: true })
    sort?: UsersSortArgs,
  ): Promise<PaginatedUsers> {
    return this.userService.findAll(query, sort);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }
}
