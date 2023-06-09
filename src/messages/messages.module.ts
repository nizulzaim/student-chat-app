import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { PubSub } from 'graphql-subscriptions';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, forwardRef(() => ConversationsModule)],
  providers: [
    MessagesService,
    MessagesResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
