import { Module } from '@nestjs/common';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabasesModule } from '@libs/databases';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthsModule } from './auths/auths.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auths/auth.guard';
import { SortEnum, graphqlOptions } from '@libs/commons';
import { FacultiesModule } from './faculties/faculties.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ObjectIdScalar } from '@libs/scalars';
import { SemestersModule } from './semesters/semesters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      ...graphqlOptions,
      driver: ApolloDriver,
    }),
    UsersModule,
    DatabasesModule,
    AuthsModule,
    FacultiesModule,
    ConversationsModule,
    MessagesModule,
    SubjectsModule,
    SemestersModule,
  ],
  providers: [
    ObjectIdScalar,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    registerEnumType(SortEnum, { name: 'SortEnum' });
  }
}
