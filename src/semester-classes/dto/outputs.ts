import { Paginated } from '@libs/commons';
import { ObjectType } from '@nestjs/graphql';
import { SemesterClass } from '../entities/semester-class.entity';

@ObjectType()
export class PaginatedSemesterClasses extends Paginated(SemesterClass) {}
