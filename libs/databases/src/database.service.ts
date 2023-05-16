import { Database } from './database.interface';
import {
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  Scope,
} from '@nestjs/common';
import {
  AggregateOptions,
  Db,
  Document,
  Filter,
  FindOptions,
  MongoClient,
  ObjectId,
  SchemaMember,
  WithId,
} from 'mongodb';
import { MasterEntity } from './master.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class DatabaseService<T extends MasterEntity> {
  private tableName: string;
  private readonly client: MongoClient;
  private readonly db: Db;

  constructor(
    @Optional() @Inject('MONGODB') private readonly mongodb: Database,
  ) {
    this.client = this.mongodb.client;
    this.db = this.mongodb.database;
  }

  setCollection(t: typeof MasterEntity) {
    this.tableName = t.getTableName();
  }

  async aggregate<D = Document>(
    pipeline: Document[],
    options?: AggregateOptions,
  ): Promise<D[]> {
    const result = await this.db
      .collection(this.tableName)
      .aggregate(pipeline, options)
      .toArray();
    return result as D[];
  }

  async aggregateOne<D = Document>(
    pipeline: Document[],
    options?: AggregateOptions,
  ): Promise<D> {
    const result = await this.db
      .collection(this.tableName)
      .aggregate(pipeline, options)
      .next();
    return result as D;
  }

  async findAll(
    query?: Filter<T>,
    projection?: SchemaMember<any, any>,
    options: FindOptions = null,
  ): Promise<T[]> {
    const pQuery = {
      ...query,
      isDeleted: { $in: [false, undefined] },
    };
    const { sort = null, ...otherOptions } = options || {};
    const cursor = this.db
      .collection<T>(this.tableName)
      .find<T>(pQuery, otherOptions)
      .project<T>(projection ?? {});

    if (sort) {
      cursor.sort(sort);
    }

    const results = await cursor.toArray();

    return results;
  }

  async find(
    _id: string,
    projection: SchemaMember<any, any> = null,
    options: FindOptions = null,
  ): Promise<WithId<T>> {
    if (!_id) {
      throw new BadRequestException(`Field "_id" can't be empty`);
    }
    if (!ObjectId.isValid(`${_id}`)) {
      throw new BadRequestException(`Field "_id" got invalid ID = ${_id}`);
    }

    const filter: Filter<T> = {
      _id: new ObjectId(_id),
      isDeleted: false,
    } as unknown as Filter<T>;

    const result = await this.db.collection<T>(this.tableName).findOne(filter, {
      ...options,
      projection,
    });

    return result;
  }

  async findBy(
    query?: Filter<T>,
    projection: SchemaMember<any, any> = null,
    options: FindOptions = null,
  ): Promise<T> {
    const pQuery = { ...query, isDeleted: { $in: [false, undefined] } };
    const result = await this.db
      .collection<T>(this.tableName)
      .findOne(pQuery, { ...options, projection });
    return result as T;
  }

  async findOne(
    query?: Filter<T>,
    projection: SchemaMember<any, any> = null,
    options: FindOptions = null,
  ): Promise<T> {
    return this.findBy(query, projection, options);
  }
}
