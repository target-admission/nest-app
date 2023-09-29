import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import Exam from './entities/exam.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';

@Injectable()
export class ExamsService {
  async create(createExamDto: CreateExamDto) {
    try {
      const {
        name,
        description,
        attendee_type,
        duration,
        is_archivable,
        live_datetime,
        negative_mark,
        positive_mark,
        question_bank_id,
        type,
      } = createExamDto;
      // Create Exam

      const exam = await Exam.create({
        name,
        description,
        attendee_type,
        duration,
        is_archivable,
        live_datetime,
        negative_mark,
        positive_mark,
        question_bank_id,
        type,
      });

      return {
        success: true,
        data: exam.dataValues,
        message: 'Exam created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(
    query?: IPaginationQuery,
    type?: string,
    attendee_type?: string,
    is_archivable?: boolean,
    question_bank_id?: number,
  ) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops([
      'name',
      'description',
      'type',
      'attendee_type',
    ]);

    const filters = pagination.format_filters({
      type,
      attendee_type,
      is_archivable,
      question_bank_id,
    });

    return pagination.arrange(
      await Exam.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
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
    const exam = await Exam.findByPk(id, {
      paranoid: false,
    });

    if (!exam) {
      throw new NotFoundException(`Exam not found`);
    }
    return {
      message: 'Exam fetched successfully',
      data: exam,
    };
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    try {
      const {
        name,
        description,
        attendee_type,
        duration,
        is_archivable,
        live_datetime,
        negative_mark,
        positive_mark,
        question_bank_id,
        type,
      } = updateExamDto;

      const exam = await Exam.findByPk(id);

      if (!exam) {
        throw new NotFoundException(`Exam not found`);
      }

      await exam.update({
        name,
        description,
        attendee_type,
        duration,
        is_archivable,
        live_datetime,
        negative_mark,
        positive_mark,
        question_bank_id,
        type,
      });
      return {
        message: 'Exam updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const exam = await Exam.findByPk(id, {
      paranoid: false,
    });

    if (!exam) {
      throw new NotFoundException(`Exam not found`);
    }

    if (permanent) {
      await exam.destroy({ force: true });
      return {
        message: 'Exam deleted permanently',
      };
    } else if (restore) {
      if (exam.deleted_at === null) {
        throw new BadRequestException(`Exam not deleted`);
      }
      exam.restore();
      return {
        message: 'Exam restored successfully',
      };
    }

    await exam.destroy();

    return {
      message: 'Exam deleted successfully',
    };
  }
}
