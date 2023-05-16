import { Db, MongoClient } from 'mongodb';

export interface Database {
  client: MongoClient;
  database: Db;
}
