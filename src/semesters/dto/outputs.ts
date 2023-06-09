import { Paginated } from '@libs/commons';
import { Semester } from '../entities/semester.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedSemesters extends Paginated(Semester) {}
