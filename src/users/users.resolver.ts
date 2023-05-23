import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { BaseResolver, RequestWithUser } from '@libs/commons';
import { UsersService } from './users.service';
import { PaginatedUsers } from './dto/outputs';
import { FindAllUsersInput, FindOneUserInput, UsersSortArgs } from './dto/args';
import { CreateUserInput } from './dto/input';
import { Context } from '@libs/decorators';

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

  @Query(() => User)
  user(@Args('query') query: FindOneUserInput): Promise<User> {
    return this.userService.findOne(query);
  }

  @Query(() => User)
  currentUser(@Context() ctx: RequestWithUser): Promise<User> {
    return this.userService.findOne({ _id: ctx.user._id });
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @ResolveField(() => String)
  displayName(@Parent() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }
}
