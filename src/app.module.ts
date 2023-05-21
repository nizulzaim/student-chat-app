import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabasesModule } from '@libs/databases';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomLogger } from '@libs/logger';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { AuthsModule } from './auths/auths.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auths/auth.guard';

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
              ]
            : [],
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
