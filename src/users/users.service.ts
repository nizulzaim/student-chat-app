import { DatabaseService } from '@libs/databases';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOneUserInput } from './dto/args';

@Injectable()
export class UsersService {
  constructor(private readonly user: DatabaseService<User>) {
    this.user.setCollection(User);
  }

  async findAll(): Promise<User[]> {
    return this.user.findAll();
  }

  async findOne(args: FindOneUserInput): Promise<User> {
    return this.user.findOne(args);
  }
}
