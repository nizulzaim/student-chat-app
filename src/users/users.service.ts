import { DatabaseService } from '@libs/databases';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly user: DatabaseService<User>) {
    this.user.setCollection(User);
  }

  async users(): Promise<User[]> {
    return this.user.findAll();
  }
}
