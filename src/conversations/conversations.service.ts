import { DatabaseService } from '@libs/databases';
import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput, UpdateConversationInput } from './dto/input';
import {
  ConversationsSortArgs,
  FindAllConversationsInput,
  FindOneConversationInput,
} from './dto/args';
import {
  RequestWithUser,
  paginatedResultCreator,
  searchQuery,
} from '@libs/commons';
import { ObjectId } from 'mongodb';

@Injectable()
export class ConversationsService {
  constructor(private readonly conversations: DatabaseService<Conversation>) {
    this.conversations.setCollection(Conversation);
  }

  create(input: CreateConversationInput, context: RequestWithUser) {
    return this.conversations.create({
      ...input,
      userIds: [...input.userIds, context.user._id].map((i) => new ObjectId(i)),
      isActive: true,
    });
  }

  update(input: UpdateConversationInput) {
    const { _id, ...data } = input;
    return this.conversations.update({ _id: new ObjectId(_id) }, data);
  }

  async findAll(
    input: FindAllConversationsInput,
    sort: ConversationsSortArgs,
    context: RequestWithUser,
  ) {
    const { page, limit, ...data } = input;
    const query = { ...data, userIds: context.user._id };

    const results = await this.conversations.findAllAndCount(query, {
      limit,
      skip: (page - 1) * limit,
      sort: { updatedAt: -1 },
    });

    return paginatedResultCreator({ ...results, page, limit });
  }

  findOne(input: FindOneConversationInput) {
    return this.conversations.findOne(input);
  }
}
