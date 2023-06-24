import { DatabaseService } from '@libs/databases';
import { Global, Injectable } from '@nestjs/common';
import {
  FindAllSemesterClassesInput,
  FindOneSemesterClassInput,
  SemesterClassesSortArgs,
} from './dto/args';
import {
  paginatedResultCreator,
  searchQuery,
  transformSort,
} from '@libs/commons';
import {
  CreateSemesterClassInput,
  UpdateSemesterClassInput,
} from './dto/input';
import { Filter } from 'mongodb';
import { SemesterClass } from './entities/semester-class.entity';
import { PaginatedSemesterClasses } from './dto/outputs';
import { SubjectsService } from 'src/subjects/subjects.service';
import { SemestersService } from 'src/semesters/semesters.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { ConversationType } from 'src/conversations/entities/conversation.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
@Global()
export class SemesterClassesService {
  constructor(
    private readonly semesterClass: DatabaseService<SemesterClass>,
    private readonly subjectService: SubjectsService,
    private readonly semesterService: SemestersService,
    private readonly conversationService: ConversationsService,
    private readonly userService: UsersService,
  ) {
    this.semesterClass.setCollection(SemesterClass);
  }

  rawFindAll(args: Filter<SemesterClass>): Promise<SemesterClass[]> {
    return this.semesterClass.findAll(args);
  }

  async findAll(
    input: FindAllSemesterClassesInput,
    sort: SemesterClassesSortArgs,
  ): Promise<PaginatedSemesterClasses> {
    const { page, limit, ...data } = input;
    const query = searchQuery<SemesterClass, FindAllSemesterClassesInput>(
      data,
      [],
    );

    const results = await this.semesterClass.findAllAndCount(query, {
      limit,
      skip: (page - 1) * limit,
      sort: transformSort(sort),
    });

    return paginatedResultCreator({ ...results, page, limit });
  }

  async findOne(args: FindOneSemesterClassInput): Promise<SemesterClass> {
    return this.semesterClass.findOne(args);
  }

  async create(input: CreateSemesterClassInput): Promise<SemesterClass> {
    const subject = await this.subjectService.findOne({ _id: input.subjectId });
    const semester = await this.semesterService.findOne({
      _id: input.semesterId,
    });

    const name = `${subject.name} ${semester.name}`;
    const result = await this.semesterClass.create({ ...input, name });
    const conversation = await this.conversationService.createRaw({
      userIds: [result.lecturerId, ...result.studentsId],
      type: ConversationType.group,
      name: result.name,
    });

    await this.semesterClass.update(
      { _id: result._id },
      { conversationId: conversation._id },
    );

    return result;
  }

  async update(input: UpdateSemesterClassInput): Promise<SemesterClass> {
    const { _id, ...data } = input;
    return this.semesterClass.update({ _id }, data);
  }

  getSemester(parent: SemesterClass) {
    return this.semesterService.findOne({ _id: parent.semesterId });
  }

  getSubject(parent: SemesterClass) {
    return this.subjectService.findOne({ _id: parent.subjectId });
  }

  getLecturer(parent: SemesterClass) {
    return this.userService.findOne({ _id: parent.lecturerId });
  }
}
