import { CustomLogger } from '@libs/logger';
import { ConfigService } from '@nestjs/config';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';

export const graphqlOptions = {
  useFactory: (configService: ConfigService) => {
    const isNotProduction = configService.get('NODE_ENV') !== 'production';
    return {
      autoSchemaFile: true,
      logger: new CustomLogger('Apollo GraphQL'),
      playground: false,
      subscriptions: {
        'graphql-ws': true,
      },
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
};
