import { DatabaseService } from '@libs/databases';
import { Global, Injectable } from '@nestjs/common';
import { Faculty } from './entities/faculty.entity';
import {
  FindAllFacultiesInput,
  FindOneFacultyInput,
  FacultiesSortArgs,
} from './dto/args';
import {
  paginatedResultCreator,
  searchQuery,
  transformSort,
} from '@libs/commons';
import { PaginatedFaculties } from './dto/outputs';
import { CreateFacultyInput, UpdateFacultyInput } from './dto/input';
import { Filter } from 'mongodb';

@Injectable()
@Global()
export class FacultiesService {
  constructor(private readonly faculty: DatabaseService<Faculty>) {
    this.faculty.setCollection(Faculty);
  }

  rawFindAll(args: Filter<Faculty>): Promise<Faculty[]> {
    return this.faculty.findAll(args);
  }

  async findAll(
    input: FindAllFacultiesInput,
    sort: FacultiesSortArgs,
  ): Promise<PaginatedFaculties> {
    const { page, limit, ...data } = input;
    const query = searchQuery<Faculty, FindAllFacultiesInput>(data, ['name']);

    const results = await this.faculty.findAllAndCount(query, {
      limit,
      skip: (page - 1) * limit,
      sort: transformSort(sort),
    });

    return paginatedResultCreator({ ...results, page, limit });
  }

  async findOne(args: FindOneFacultyInput): Promise<Faculty> {
    return this.faculty.findOne(args);
  }

  async create(input: CreateFacultyInput): Promise<Faculty> {
    return this.faculty.createUnique(input, ['name']);
  }

  async update(input: UpdateFacultyInput): Promise<Faculty> {
    const { _id, ...data } = input;
    return this.faculty.update({ _id }, data);
  }
}
