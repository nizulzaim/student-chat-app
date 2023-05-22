import { DatabaseService } from '@libs/databases';
import { Global, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindAllUsersInput, FindOneUserInput, UsersSortArgs } from './dto/args';
import {
  paginatedResultCreator,
  searchQuery,
  transformSort,
} from '@libs/commons';
import { PaginatedUsers } from './dto/outputs';
import * as argon2 from 'argon2';
import { CreateUserInput } from './dto/input';
import { Filter } from 'mongodb';

@Injectable()
@Global()
export class UsersService {
  constructor(private readonly user: DatabaseService<User>) {
    this.user.setCollection(User);
  }

  rawFindAll(args: Filter<User>) {
    return this.user.findAll(args);
  }

  async findAll(
    input: FindAllUsersInput,
    sort: UsersSortArgs,
  ): Promise<PaginatedUsers> {
    const { page, limit, ...data } = input;
    const query = searchQuery<User, FindAllUsersInput>(data, [
      'firstName',
      'lastName',
      'email',
    ]);

    const results = await this.user.findAllAndCount(query, {
      limit,
      skip: (page - 1) * limit,
      sort: transformSort(sort),
    });

    return paginatedResultCreator({ ...results, page, limit });
  }

  async findOne(args: FindOneUserInput): Promise<User> {
    return this.user.findOne(args);
  }

  async create(input: CreateUserInput) {
    const password = await argon2.hash(input.password);
    return this.user.createUnique({ ...input, password }, ['email']);
  }
}
