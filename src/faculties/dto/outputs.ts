import { Paginated } from '@libs/commons';
import { Faculty } from '../entities/faculty.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedFaculties extends Paginated(Faculty) {}
