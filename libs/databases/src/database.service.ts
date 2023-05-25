import {
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  Scope,
} from '@nestjs/common';
import {
  Collection,
  CountDocumentsOptions,
  Db,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  MongoClient,
  ObjectId,
  UpdateFilter,
  WithId,
} from 'mongodb';
import { Database } from './database.interface';
import { MasterEntity } from './master.entity';
import { RequestWithUser } from '@libs/commons';
import { CONTEXT } from '@nestjs/graphql';

@Injectable({ scope: Scope.TRANSIENT })
export class DatabaseService<E extends MasterEntity> {
  private readonly client: MongoClient;
  private readonly db: Db;
  private collection: Collection<E>;
  private tableName: string;

  constructor(
    @Optional() @Inject('MONGODB') private readonly mongodb: Database,
    @Inject(CONTEXT) private readonly context: { req: RequestWithUser },
  ) {
    this.client = this.mongodb.client;
    this.db = this.mongodb.database;
    // this.collection = this.db.collection(this.tableName);
  }

  setCollection(t: typeof MasterEntity) {
    this.tableName = t.getTableName();
    this.collection = this.db.collection(this.tableName);
  }

  async findAll(rawFilter: Filter<E>, options?: FindOptions): Promise<E[]> {
    const filter: Filter<E> = {
      ...rawFilter,
      isDeleted: false,
    } as Filter<E>;

    const cursor = this.collection.find<E>(filter, options);

    return await cursor.toArray();
  }

  async count(
    rawFilter: Filter<E>,
    options?: CountDocumentsOptions,
  ): Promise<number> {
    const filter: Filter<E> = {
      ...rawFilter,
      isDeleted: false,
    } as Filter<E>;

    return this.collection.countDocuments(filter, options);
  }

  async findAllAndCount(rawFilter: Filter<E>, options?: FindOptions) {
    const filter: Filter<E> = {
      ...rawFilter,
      isDeleted: false,
    } as Filter<E>;
    const cursor = this.collection.find<E>(filter, options);
    const count = this.count(rawFilter);
    const results: [E[], number] = await Promise.all([cursor.toArray(), count]);

    return {
      count: results[1],
      items: results[0],
    };
  }

  async find(_id: ObjectId, options?: FindOptions): Promise<E> {
    const filter: Filter<E> = {
      _id: _id,
      isDeleted: false,
    } as Filter<E>;

    return this.findOne(filter, options);
  }

  async findOne(rawFilter: Filter<E>, options?: FindOptions): Promise<E> {
    if (Object.keys(rawFilter).length === 0) {
      return null;
    }
    const filter: Filter<E> = {
      ...rawFilter,
      isDeleted: false,
    } as Filter<E>;

    const result = await this.collection.findOne<E>(filter, options);

    return result;
  }

  async createUnique(
    data:
      | Omit<
          E,
          | 'createdAt'
          | 'updatedAt'
          | 'isDeleted'
          | 'createdById'
          | 'updatedById'
          | '_id'
        >
      | Omit<
          E,
          | 'createdAt'
          | 'updatedAt'
          | 'isDeleted'
          | 'createdById'
          | 'updatedById'
        >,
    uniqueFields: (keyof Omit<
      E,
      'createdAt' | 'updatedAt' | 'isDeleted' | '_id'
    >)[],
  ) {
    const fieldToCheck: Partial<
      Omit<E, 'createdAt' | 'updatedAt' | 'isDeleted' | '_id'>
    > = {};

    console.log(fieldToCheck);

    uniqueFields.forEach((i) => (fieldToCheck[i] = data[i as any]));

    const existingResult = await this.collection.findOne(
      fieldToCheck as Filter<E>,
    );
    if (existingResult)
      throw new Error(
        `Data exist for following fields: \n ${Object.keys(fieldToCheck)
          .map((value) => `${value}: ${fieldToCheck[value as any]}\n`)
          .join()}`,
      );

    return this.create(data);
  }

  async create(
    data:
      | Omit<
          E,
          | 'createdAt'
          | 'updatedAt'
          | 'isDeleted'
          | '_id'
          | 'createdById'
          | 'updatedById'
        >
      | Omit<
          E,
          | 'createdAt'
          | 'updatedAt'
          | 'isDeleted'
          | 'createdById'
          | 'updatedById'
        >,
  ): Promise<WithId<E>> {
    const user = this.context.req.user;
    const newData = {
      ...data,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: user?._id ?? null,
      updatedById: user?._id ?? null,
      isDeleted: false,
    } as Filter<E>;

    const options: FindOneAndUpdateOptions = {
      upsert: true,
      returnDocument: 'after',
    };

    const { value } = await this.collection.findOneAndUpdate(
      newData,
      { $set: {} } as UpdateFilter<E>,
      options,
    );

    return value;
  }

  async update(
    filter: Filter<E>,
    data:
      | Partial<
          Omit<
            E,
            | 'createdAt'
            | 'updatedAt'
            | 'isDeleted'
            | 'createdById'
            | 'updatedById'
          >
        >
      | UpdateFilter<
          Omit<
            E,
            | 'createdAt'
            | 'updatedAt'
            | 'isDeleted'
            | 'createdById'
            | 'updatedById'
          >
        >,
    isRaw = false,
  ): Promise<WithId<E>> {
    const newFilter = {
      ...filter,
      isDeleted: false,
    } as Filter<E>;

    const user = this.context.req.user;

    const newData = {
      $set: {
        ...data,
        updatedAt: new Date(),
        updatedById: user?._id ?? null,
      },
    } as UpdateFilter<E>;

    const options: FindOneAndUpdateOptions = {
      returnDocument: 'after',
    };

    const [{ value }] = await Promise.all([
      this.collection.findOneAndUpdate(
        newFilter,
        !isRaw ? newData : (data as UpdateFilter<E>),
        options,
      ),
    ]);

    if (!value) throw new BadRequestException('Cannot find record');

    return value;
  }
}
