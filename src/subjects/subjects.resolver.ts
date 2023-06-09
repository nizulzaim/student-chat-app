import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Subject } from './entities/subject.entity';
import { PaginatedSubjects } from './dto/outputs';
import { UsersService } from 'src/users/users.service';
import { SubjectsService } from './subjects.service';
import { BaseResolver } from '@libs/commons';
import {
  SubjectsSortArgs,
  FindAllSubjectsInput,
  FindOneSubjectInput,
} from './dto/args';
import { CreateSubjectInput, UpdateSubjectInput } from './dto/input';

@Resolver(() => Subject)
export class SubjectsResolver extends BaseResolver(Subject) {
  constructor(
    private readonly userService: UsersService,
    private readonly subjectService: SubjectsService,
  ) {
    super(userService);
  }

  @Query(() => PaginatedSubjects)
  subjects(
    @Args('query')
    query: FindAllSubjectsInput,
    @Args('sort', { nullable: true })
    sort?: SubjectsSortArgs,
  ): Promise<PaginatedSubjects> {
    return this.subjectService.findAll(query, sort);
  }

  @Query(() => Subject)
  subject(@Args('query') query: FindOneSubjectInput): Promise<Subject> {
    return this.subjectService.findOne(query);
  }

  @Mutation(() => Subject)
  async createSubject(@Args('input') input: CreateSubjectInput) {
    return this.subjectService.create(input);
  }

  @Mutation(() => Subject)
  async updateSubject(@Args('input') input: UpdateSubjectInput) {
    return this.subjectService.update(input);
  }
}
