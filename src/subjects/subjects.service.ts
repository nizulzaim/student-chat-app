import { DatabaseService } from '@libs/databases';
import { Injectable } from '@nestjs/common';
import { Subject } from './entities/subject.entity';
import {
  FindAllSubjectsInput,
  FindOneSubjectInput,
  SubjectsSortArgs,
} from './dto/args';
import {
  paginatedResultCreator,
  searchQuery,
  transformSort,
} from '@libs/commons';
import { PaginatedSubjects } from './dto/outputs';
import { CreateSubjectInput, UpdateSubjectAddDocument, UpdateSubjectInput } from './dto/input';
import { Filter } from 'mongodb';

@Injectable()
export class SubjectsService {
  constructor(private readonly subject: DatabaseService<Subject>) {
    this.subject.setCollection(Subject);
  }

  rawFindAll(args: Filter<Subject>): Promise<Subject[]> {
    return this.subject.findAll(args);
  }

  async findAll(
    input: FindAllSubjectsInput,
    sort: SubjectsSortArgs,
  ): Promise<PaginatedSubjects> {
    const { page, limit, ...data } = input;
    const query = searchQuery<Subject, FindAllSubjectsInput>(data, [
      'name',
      'code',
    ]);

    const results = await this.subject.findAllAndCount(query, {
      limit,
      skip: (page - 1) * limit,
      sort: transformSort(sort),
    });

    return paginatedResultCreator({ ...results, page, limit });
  }

  async findOne(args: FindOneSubjectInput): Promise<Subject> {
    return this.subject.findOne(args);
  }

  async create(input: CreateSubjectInput): Promise<Subject> {
    return this.subject.createUnique(input, ['code']);
  }

  async update(input: UpdateSubjectInput): Promise<Subject> {
    const { _id, ...data } = input;
    return this.subject.update({ _id }, data);
  }

  async addDocument(input: UpdateSubjectAddDocument) {
    const {_id, ...data} = input;

    return this.subject.update({_id}, {$push: {
      weekAttachments: {...data, createdAt: new Date()}
    }}, true)
  }
}
