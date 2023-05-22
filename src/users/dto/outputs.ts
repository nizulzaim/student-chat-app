import { Paginated } from '@libs/commons';
import { User } from '../entities/user.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}
