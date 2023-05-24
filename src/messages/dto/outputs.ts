import { Paginated } from '@libs/commons';
import { ObjectType } from '@nestjs/graphql';
import { Message } from '../entities/message.entity';

@ObjectType()
export class PaginatedMessage extends Paginated(Message) {}
