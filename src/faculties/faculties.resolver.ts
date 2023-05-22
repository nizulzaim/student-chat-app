import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Faculty } from './entities/faculty.entity';
import { PaginatedFaculties } from './dto/outputs';
import { UsersService } from 'src/users/users.service';
import { FacultiesService } from './faculties.service';
import { BaseResolver } from '@libs/commons';
import {
  FacultiesSortArgs,
  FindAllFacultiesInput,
  FindOneFacultyInput,
} from './dto/args';
import { CreateFacultyInput, UpdateFacultyInput } from './dto/input';

@Resolver(() => Faculty)
export class FacultiesResolver extends BaseResolver(Faculty) {
  constructor(
    private readonly userService: UsersService,
    private readonly facultyService: FacultiesService,
  ) {
    super(userService);
  }

  @Query(() => PaginatedFaculties)
  faculties(
    @Args('query')
    query: FindAllFacultiesInput,
    @Args('sort', { nullable: true })
    sort?: FacultiesSortArgs,
  ): Promise<PaginatedFaculties> {
    return this.facultyService.findAll(query, sort);
  }

  @Query(() => Faculty)
  faculty(@Args('query') query: FindOneFacultyInput): Promise<Faculty> {
    return this.facultyService.findOne(query);
  }

  @Mutation(() => Faculty)
  async createFaculty(@Args('input') input: CreateFacultyInput) {
    return this.facultyService.create(input);
  }

  @Mutation(() => Faculty)
  async updateFaculty(@Args('input') input: UpdateFacultyInput) {
    return this.facultyService.update(input);
  }
}
