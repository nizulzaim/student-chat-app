import { Module, forwardRef } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { UsersModule } from 'src/users/users.module';
import { registerEnumType } from '@nestjs/graphql';
import { ConversationType } from './entities/conversation.entity';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [UsersModule, forwardRef(() => MessagesModule)],
  providers: [ConversationsService, ConversationsResolver],
  exports: [ConversationsService],
})
export class ConversationsModule {
  constructor() {
    registerEnumType(ConversationType, { name: 'ConversationType' });
  }
}
