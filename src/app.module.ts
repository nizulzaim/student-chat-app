import { Module } from '@nestjs/common';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabasesModule } from '@libs/databases';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomLogger } from '@libs/logger';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { AuthsModule } from './auths/auths.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auths/auth.guard';
import { SortEnum } from '@libs/commons';
import { FacultiesModule } from './faculties/faculties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabasesModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const isNotProduction = configService.get('NODE_ENV') !== 'production';
        return {
          autoSchemaFile: true,
          logger: new CustomLogger('Apollo GraphQL'),
          playground: false,
          plugins: isNotProduction
            ? [
                ApolloServerPluginInlineTrace(),
                ApolloServerPluginLandingPageLocalDefault(),
                ApolloServerPluginUsageReporting({
                  sendHeaders: {
                    all: true,
                  },
                  sendErrors: {
                    unmodified: true,
                  },
                  sendReportsImmediately: true,
                }),
              ]
            : [ApolloServerPluginLandingPageProductionDefault()],
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthsModule,
    FacultiesModule,
  ],
  providers: [
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
