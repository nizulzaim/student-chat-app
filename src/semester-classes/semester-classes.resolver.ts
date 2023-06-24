import {
  Args,
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { BaseResolver } from '@libs/commons';
import {
  FindAllSemesterClassesInput,
  SemesterClassesSortArgs,
  FindOneSemesterClassInput,
} from './dto/args';
import {
  CreateSemesterClassInput,
  UpdateSemesterClassInput,
} from './dto/input';
import { PaginatedSemesterClasses } from './dto/outputs';
import { SemesterClass } from './entities/semester-class.entity';
import { SemesterClassesService } from './semester-classes.service';
import { Semester } from 'src/semesters/entities/semester.entity';
import { Context } from '@libs/decorators';
import { User } from 'src/users/entities/user.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@Resolver(() => SemesterClass)
export class SemesterClassesResolver extends BaseResolver(SemesterClass) {
  constructor(
    private readonly userService: UsersService,
    private readonly semesterClassService: SemesterClassesService,
  ) {
    super(userService);
  }

  @Query(() => PaginatedSemesterClasses)
  semesterClasses(
    @Args('query')
    query: FindAllSemesterClassesInput,
    @Args('sort', { nullable: true })
    sort?: SemesterClassesSortArgs,
  ): Promise<PaginatedSemesterClasses> {
    return this.semesterClassService.findAll(query, sort);
  }

  @Query(() => SemesterClass)
  semesterClass(
    @Args('query') query: FindOneSemesterClassInput,
  ): Promise<SemesterClass> {
    return this.semesterClassService.findOne(query);
  }

  @Mutation(() => SemesterClass)
  async createSemesterClass(@Args('input') input: CreateSemesterClassInput) {
    return this.semesterClassService.create(input);
  }

  @Mutation(() => SemesterClass)
  async updateSemesterClass(@Args('input') input: UpdateSemesterClassInput) {
    return this.semesterClassService.update(input);
  }

  @ResolveField(() => Semester)
  semester(@Parent() parent: SemesterClass) {
    return this.semesterClassService.getSemester(parent);
  }

  @ResolveField(() => Subject)
  subject(@Parent() parent: SemesterClass) {
    return this.semesterClassService.getSubject(parent);
  }

  @ResolveField(() => User)
  lecturer(@Parent() parent: SemesterClass) {
    return this.semesterClassService.getLecturer(parent);
  }
}
