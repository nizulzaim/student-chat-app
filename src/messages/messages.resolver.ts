import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { BaseResolver, RequestWithUser } from '@libs/commons';
import { PaginatedMessage } from './dto/outputs';
import { FindAllMessagesInput, MessagesSortArgs } from './dto/args';
import { CreateMessageInput } from './dto/input';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { Context, Public } from '@libs/decorators';

@Resolver(() => Message)
export class MessagesResolver extends BaseResolver(Message) {
  constructor(
    private readonly userService: UsersService,
    private readonly messageService: MessagesService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {
    super(userService);
  }

  @Query(() => PaginatedMessage, { nullable: true })
  messages(
    @Args('input') input: FindAllMessagesInput,
    @Args('sort') sort: MessagesSortArgs,
    @Context() ctx: RequestWithUser,
  ) {
    return this.messageService.findAll(input, sort, ctx);
  }

  @Mutation(() => Message)
  async createMessage(@Args('input') input: CreateMessageInput) {
    return this.messageService.create(input);
  }

  @Public()
  @Subscription(() => Message, {
    filter: (payload, variables) =>
      payload.messageAdded.conversationId.toString() ===
      variables.conversationId,
  })
  messageAdded(@Args('conversationId') _conversationId: string) {
    return this.pubSub.asyncIterator('messageAdded');
  }
}
