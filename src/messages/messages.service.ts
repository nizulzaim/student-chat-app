import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/input';
import { DatabaseService } from '@libs/databases';
import { Message } from './entities/message.entity';
import { FindAllMessagesInput, MessagesSortArgs } from './dto/args';
import { RequestWithUser, paginatedResultCreator } from '@libs/commons';
import { ObjectId } from 'mongodb';
import { PubSub } from 'graphql-subscriptions';
import { ConversationsService } from 'src/conversations/conversations.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly message: DatabaseService<Message>,
    @Inject('PUB_SUB') private pubSub: PubSub,
    private readonly conversationService: ConversationsService,
  ) {
    this.message.setCollection(Message);
  }

  async create(input: CreateMessageInput) {
    const result = await this.message.create({
      ...input,
      conversationId: new ObjectId(input.conversationId),
      isActive: true,
    });

    this.conversationService.update({ _id: input.conversationId });
    this.pubSub.publish('messageAdded', { messageAdded: result });

    return result;
  }

  async findAll(
    input: FindAllMessagesInput,
    sort: MessagesSortArgs,
    context: RequestWithUser,
  ) {
    const { page, limit, ...data } = input;
    const query = {
      ...data,
      conversationId: new ObjectId(data.conversationId),
    };
    const results = await this.message.findAllAndCount(query, {
      limit,
      skip: (page - 1) * limit,
      sort: { createdAt: -1 },
    });

    return paginatedResultCreator({ ...results, page, limit });
  }
}
