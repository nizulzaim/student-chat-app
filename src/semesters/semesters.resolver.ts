import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Semester } from './entities/semester.entity';
import { PaginatedSemesters } from './dto/outputs';
import { UsersService } from 'src/users/users.service';
import { SemestersService } from './semesters.service';
import { BaseResolver } from '@libs/commons';
import {
  SemestersSortArgs,
  FindAllSemestersInput,
  FindOneSemesterInput,
} from './dto/args';
import { CreateSemesterInput, UpdateSemesterInput } from './dto/input';

@Resolver(() => Semester)
export class SemestersResolver extends BaseResolver(Semester) {
  constructor(
    private readonly userService: UsersService,
    private readonly semesterService: SemestersService,
  ) {
    super(userService);
  }

  @Query(() => PaginatedSemesters)
  semesters(
    @Args('query')
    query: FindAllSemestersInput,
    @Args('sort', { nullable: true })
    sort?: SemestersSortArgs,
  ): Promise<PaginatedSemesters> {
    return this.semesterService.findAll(query, sort);
  }

  @Query(() => Semester)
  semester(@Args('query') query: FindOneSemesterInput): Promise<Semester> {
    return this.semesterService.findOne(query);
  }

  @Mutation(() => Semester)
  async createSemester(@Args('input') input: CreateSemesterInput) {
    return this.semesterService.create(input);
  }

  @Mutation(() => Semester)
  async updateSemester(@Args('input') input: UpdateSemesterInput) {
    return this.semesterService.update(input);
  }
}
