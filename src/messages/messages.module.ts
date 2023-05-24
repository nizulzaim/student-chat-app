import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { UsersModule } from 'src/users/users.module';
import { PubSub } from 'graphql-subscriptions';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [UsersModule, ConversationsModule],
  providers: [
    MessagesService,
    MessagesResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class MessagesModule {}
