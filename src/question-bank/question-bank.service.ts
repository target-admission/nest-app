import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';
import QuestionBank from './entities/question-bank.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';

@Injectable()
export class QuestionBankService {
  async create(createQuestionBankDto: CreateQuestionBankDto) {
    try {
      const { name, description, cover_image_url } = createQuestionBankDto;
      // Create question bank

      const questionbank = await QuestionBank.create({
        name,
        description,
        cover_image_url,
      });

      return {
        success: true,
        data: questionbank.dataValues,
        message: 'Question bank created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(query?: IPaginationQuery) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name', 'description']);

    const filters = pagination.format_filters({});

    return pagination.arrange(
      await QuestionBank.findAndCountAll({
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
    const questionbank = await QuestionBank.findByPk(id, {
      paranoid: false,
    });

    if (!questionbank) {
      throw new NotFoundException(`Question Bank not found`);
    }
    return {
      message: 'Question Bank fetched successfully',
      data: questionbank,
    };
  }

  async update(id: number, updateQuestionBankDto: UpdateQuestionBankDto) {
    try {
      const { name, description, cover_image_url } = updateQuestionBankDto;

      const questionbank = await QuestionBank.findByPk(id);

      if (!questionbank) {
        throw new NotFoundException(`Question Bank not found`);
      }

      await questionbank.update({
        name,
        description,
        cover_image_url,
      });
      return {
        message: 'Question Bank updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const questionbank = await QuestionBank.findByPk(id, {
      paranoid: false,
    });

    if (!questionbank) {
      throw new NotFoundException(`Question Bank not found`);
    }

    if (permanent) {
      await questionbank.destroy({ force: true });
      return {
        message: 'Question Bank deleted permanently',
      };
    } else if (restore) {
      if (questionbank.deleted_at === null) {
        throw new BadRequestException(`Question Bank not deleted`);
      }
      questionbank.restore();
      return {
        message: 'Question Bank restored successfully',
      };
    }

    await questionbank.destroy();

    return {
      message: 'Question Bank deleted successfully',
    };
  }
}
