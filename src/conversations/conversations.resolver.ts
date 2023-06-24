import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { ConversationsService } from './conversations.service';
import { BaseResolver, RequestWithUser } from '@libs/commons';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { PaginatedConversation } from './dto/output';
import {
  ConversationsSortArgs,
  FindAllConversationsInput,
  FindOneConversationInput,
} from './dto/args';
import { Context, Public } from '@libs/decorators';
import { CreateConversationInput } from './dto/input';
import { User } from 'src/users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { SemesterClass } from 'src/semester-classes/entities/semester-class.entity';
import { SemesterClassesService } from 'src/semester-classes/semester-classes.service';

@Resolver(() => Conversation)
export class ConversationsResolver extends BaseResolver(Conversation) {
  constructor(
    private readonly userService: UsersService,
    private readonly conversationService: ConversationsService,
    private readonly semesterClassService: SemesterClassesService,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
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

  @ResolveField(() => Int)
  async numberOfUnread(
    @Parent() parent: Conversation,
    @Context() ctx: RequestWithUser,
  ) {
    return this.conversationService.findNumberOfUnreadMessages(parent, ctx);
  }

  @Public()
  @Subscription(() => Conversation, {
    filter: (payload, variables) =>
      payload.conversationUpdated.userIds
        .map((i) => i.toString())
        .includes(variables.userId),
  })
  conversationUpdated(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator('conversationUpdated');
  }

  @ResolveField(() => SemesterClass, { nullable: true })
  semesterClass(@Parent() parent: Conversation) {
    if (parent.type === ConversationType.private) return null;
    return this.semesterClassService.findOne({ conversationId: parent._id });
  }
}
