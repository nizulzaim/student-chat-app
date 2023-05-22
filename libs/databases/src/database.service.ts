import { Database } from './database.interface';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Optional,
  Scope,
} from '@nestjs/common';
import {
  AggregateOptions,
  Db,
  Document,
  Filter,
  FindOptions,
  InsertOneOptions,
  MongoClient,
  ObjectId,
  SchemaMember,
  WithId,
} from 'mongodb';
import { MasterEntity } from './master.entity';
import { RequestWithUser } from '@libs/commons';
import { CONTEXT } from '@nestjs/graphql';

@Injectable({ scope: Scope.TRANSIENT })
export class DatabaseService<
  T extends MasterEntity,
  N = Omit<
    T,
    | 'createdAt'
    | 'updatedAt'
    | 'updatedById'
    | 'createdById'
    | '_id'
    | 'isDeleted'
  > & { _id?: ObjectId; isActive?: boolean },
> {
  private tableName: string;
  private readonly client: MongoClient;
  private readonly db: Db;

  constructor(
    @Optional() @Inject('MONGODB') private readonly mongodb: Database,
    @Inject(CONTEXT) private readonly context: { req: RequestWithUser },
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

  async create(
    newData: N & { _id?: ObjectId },
    options: InsertOneOptions = null,
  ): Promise<WithId<T>> {
    const { insertedId, data } = await this.rawCreate(newData, options);

    return { _id: insertedId, ...data };
  }

  async rawCreate(newData: N, options: InsertOneOptions = null) {
    const user = this.context.req.user;
    const data: any = {
      ...newData,
      isActive:
        typeof (newData as any).isActive !== 'undefined'
          ? true
          : (newData as any).isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: user?._id ?? null,
      updatedById: user?._id ?? null,
      isDeleted: false,
    };
    const { insertedId } = await this.db
      .collection<T>(this.tableName)
      .insertOne(data, options);

    if (!insertedId) {
      throw new InternalServerErrorException('Unable to create resource.');
    }

    return { insertedId, data };
  }
}
