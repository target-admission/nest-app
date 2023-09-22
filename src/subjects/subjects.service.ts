import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Subject from './entities/subject.entity';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';

@Injectable()
export class SubjectsService {
  async create(createSubjectDto: CreateSubjectDto) {
    const { subject_name, description, cover_picture } = createSubjectDto;

    await Subject.create({
      subject_name,
      description,
      cover_picture,
    });
    return {
      statusCode: 201,
      message: `${subject_name} registered as a subject successfully`,
    };
  }

  async findAll(query: IPaginationQuery) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['subject_name']);

    return pagination.arrange(
      await Subject.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...trash_query,
        },
        order,
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    const subject = await Subject.findByPk(id, {
      paranoid: false,
    });

    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }
    return {
      message: 'Subject fetched successfully',
      data: subject,
    };
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const { subject_name, description, cover_picture } = updateSubjectDto;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }
    await subject.update({
      subject_name,
      description,
      cover_picture,
    });
    return {
      message: 'Subject updated successfully',
    };
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const subject = await Subject.findByPk(id, {
      paranoid: false,
    });

    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }

    if (permanent) {
      await subject.destroy({ force: true });
      return {
        message: 'Subject deleted permanently',
      };
    } else if (restore) {
      if (subject.deleted_at === null) {
        throw new BadRequestException(`Subject not deleted`);
      }
      subject.restore();
      return {
        message: 'Subject restored successfully',
      };
    }

    await subject.destroy();

    return {
      message: 'Subject deleted successfully',
    };
  }
}
