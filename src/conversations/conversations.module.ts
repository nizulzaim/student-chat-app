import { Module, forwardRef } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { registerEnumType } from '@nestjs/graphql';
import { ConversationType } from './entities/conversation.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { PubSub } from 'graphql-subscriptions';
import { UsersModule } from 'src/users/users.module';
import { SemesterClassesModule } from 'src/semester-classes/semester-classes.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => MessagesModule),
    forwardRef(() => SemesterClassesModule),
  ],
  providers: [
    ConversationsService,
    ConversationsResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [ConversationsService],
})
export class ConversationsModule {
  constructor() {
    registerEnumType(ConversationType, { name: 'ConversationType' });
  }
}
