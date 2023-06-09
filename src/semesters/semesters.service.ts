import { DatabaseService } from '@libs/databases';
import { Injectable } from '@nestjs/common';
import { Semester } from './entities/semester.entity';
import {
  FindAllSemestersInput,
  FindOneSemesterInput,
  SemestersSortArgs,
} from './dto/args';
import {
  paginatedResultCreator,
  searchQuery,
  transformSort,
} from '@libs/commons';
import { PaginatedSemesters } from './dto/outputs';
import { CreateSemesterInput, UpdateSemesterInput } from './dto/input';
import { Filter } from 'mongodb';

@Injectable()
export class SemestersService {
  constructor(private readonly semester: DatabaseService<Semester>) {
    this.semester.setCollection(Semester);
  }

  rawFindAll(args: Filter<Semester>): Promise<Semester[]> {
    return this.semester.findAll(args);
  }

  async findAll(
    input: FindAllSemestersInput,
    sort: SemestersSortArgs,
  ): Promise<PaginatedSemesters> {
    const { page, limit, ...data } = input;
    const query = searchQuery<Semester, FindAllSemestersInput>(data, ['name']);

    const results = await this.semester.findAllAndCount(query, {
      limit,
      skip: (page - 1) * limit,
      sort: transformSort(sort),
    });

    return paginatedResultCreator({ ...results, page, limit });
  }

  async findOne(args: FindOneSemesterInput): Promise<Semester> {
    return this.semester.findOne(args);
  }

  async create(input: CreateSemesterInput): Promise<Semester> {
    const currentSemester = await this.semester.findOne({
      name: input.name,
      $or: [
        {
          startDate: { $gte: input.startDate },
          endDate: { $lte: input.endDate },
        },
      ],
    });

    if (currentSemester) throw new Error('Semester already exists');
    return this.semester.create(input);
  }

  async update(input: UpdateSemesterInput): Promise<Semester> {
    const { _id, ...data } = input;
    return this.semester.update({ _id }, data);
  }
}
