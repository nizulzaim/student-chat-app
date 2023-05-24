import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { ConversationsService } from './conversations.service';
import { BaseResolver, RequestWithUser } from '@libs/commons';
import { Conversation } from './entities/conversation.entity';
import { PaginatedConversation } from './dto/output';
import {
  ConversationsSortArgs,
  FindAllConversationsInput,
  FindOneConversationInput,
} from './dto/args';
import { Context } from '@libs/decorators';
import { CreateConversationInput } from './dto/input';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Conversation)
export class ConversationsResolver extends BaseResolver(Conversation) {
  constructor(
    private readonly userService: UsersService,
    private readonly conversationService: ConversationsService,
  ) {
    super(userService);
  }

  @Query(() => PaginatedConversation)
  async conversations(
    @Args('input') input: FindAllConversationsInput,
    @Args('sort') sort: ConversationsSortArgs,
    @Context() ctx: RequestWithUser,
  ) {
    return this.conversationService.findAll(input, sort, ctx);
  }

  @Query(() => Conversation)
  async conversation(@Args('input') input: FindOneConversationInput) {
    return this.conversationService.findOne(input);
  }

  @Mutation(() => Conversation)
  async createConversation(
    @Args('input') input: CreateConversationInput,
    @Context() ctx: RequestWithUser,
  ) {
    return this.conversationService.create(input, ctx);
  }

  @ResolveField(() => [User])
  async users(@Parent() parent: Conversation) {
    return this.userService.rawFindAll({
      _id: { $in: parent.userIds },
    });
  }
}
