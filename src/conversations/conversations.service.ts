import { DatabaseService } from '@libs/databases';
import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput, UpdateConversationInput } from './dto/input';
import {
  ConversationsSortArgs,
  FindAllConversationsInput,
  FindOneConversationInput,
} from './dto/args';
import { RequestWithUser, paginatedResultCreator } from '@libs/commons';
import { ObjectId } from 'mongodb';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversations: DatabaseService<Conversation>,
    private readonly messageService: MessagesService,
  ) {
    this.conversations.setCollection(Conversation);
  }

  create(input: CreateConversationInput, context: RequestWithUser) {
    return this.conversations.create({
      ...input,
      userIds: [...input.userIds, context.user._id].map((i) => new ObjectId(i)),
      isActive: true,
    });
  }

  async update(input: UpdateConversationInput) {
    const { _id, userId, ...data } = input;
    const currentRecord = await this.conversations.findOne({
      _id: new ObjectId(_id),
    });

    const currentMetadata = currentRecord.usersMeta ?? [];
    const currentUserMetaIndex = userId
      ? currentMetadata.findIndex(
          (i) => i.userId.toString() === userId.toString(),
        )
      : -1;

    if (currentUserMetaIndex > -1) {
      currentMetadata[currentUserMetaIndex] = {
        ...currentMetadata[currentUserMetaIndex],
        lastReadAt: new Date(),
      };
    } else {
      currentMetadata.push({
        userId: new ObjectId(userId),
        lastReadAt: new Date(),
      });
    }

    return this.conversations.update(
      { _id: new ObjectId(_id) },
      {
        ...data,
        usersMeta: currentMetadata,
      },
    );
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

  findNumberOfUnreadMessages(
    conversation: Conversation,
    context: RequestWithUser,
  ) {
    if (
      !conversation.userIds
        .map((i) => i.toString())
        .includes(context.user._id.toString())
    ) {
      return 0;
    }
    const meta = conversation.usersMeta?.find(
      (i) => i.userId.toString() === context.user._id.toString(),
    );

    if (!meta) {
      return this.messageService.countFromDate({
        conversationId: new ObjectId(conversation._id),
        minDate: conversation.createdAt,
      });
    }

    return this.messageService.countFromDate({
      conversationId: new ObjectId(conversation._id),
      minDate: new Date(meta.lastReadAt),
    });
  }
}
