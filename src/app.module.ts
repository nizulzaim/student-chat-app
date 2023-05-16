import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { UsersModule } from './users/users.module';
import { useHive } from '@graphql-hive/client';
import { ConfigModule } from '@nestjs/config';
import { DatabasesModule } from '@libs/databases';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabasesModule,
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: true,
      healthCheckEndpoint: '/health',
      plugins: [
        useHive({
          debug: true,
          usage: true,
          token: 'f195e08b4c6be4db558519eb1be244fd',
        }),
      ],
    }),
    UsersModule,
  ],
})
export class AppModule {}
