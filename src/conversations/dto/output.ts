import { Paginated } from '@libs/commons';
import { ObjectType } from '@nestjs/graphql';
import { Conversation } from '../entities/conversation.entity';

@ObjectType()
export class PaginatedConversation extends Paginated(Conversation) {}
