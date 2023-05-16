import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { Database } from './database.interface';

const logger = new Logger('MongoDB');

export const databaseProviders = [
  {
    provide: 'MONGODB',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<Database> => {
      const MONGO_URI = configService.get<string>('MONGO_URI');
      const MONGO_DBNAME = configService.get<string>('MONGO_DBNAME');

      try {
        const client = new MongoClient(MONGO_URI);
        logger.log('Connecting to database..');
        await client.connect();
        const database = client.db(MONGO_DBNAME);
        await database.command({ ping: 1 });
        logger.log('Database connection successfully');
        return { client, database };
      } catch (err) {
        logger.error(err);
        throw err;
      }
    },
  },
];
