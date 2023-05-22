import { MasterEntity } from '@libs/databases/master.entity';
import { Type } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

export function BaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver(() => classRef, { isAbstract: true })
  abstract class BaseResolverHost {
    constructor(private readonly user: UsersService) {}

    @ResolveField(() => User)
    async createdBy(@Parent() data: T): Promise<User> {
      return this.user.findOne({
        _id: (data as unknown as MasterEntity).createdById,
      });
    }

    @ResolveField(() => User)
    async updatedBy(@Parent() data: T): Promise<User> {
      return this.user.findOne({
        _id: (data as unknown as MasterEntity).updatedById,
      });
    }
  }
  return BaseResolverHost;
}
