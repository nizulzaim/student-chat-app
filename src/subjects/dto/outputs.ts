import { Paginated } from '@libs/commons';
import { Subject } from '../entities/subject.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedSubjects extends Paginated(Subject) {}
