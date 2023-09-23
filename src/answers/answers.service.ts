import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import Answer from './entities/answer.entity';
import { Op } from 'sequelize';
import Question from 'src/questions/entities/question.entity';

@Injectable()
export class AnswersService {
  async create(createAnswerDto: CreateAnswerDto) {
    try {
      const { title, attachment, question_id } = createAnswerDto;
      // Create question bank

      const answer = await Answer.create({
        title,
        attachment,
        question_id,
      });

      return {
        success: true,
        data: answer.dataValues,
        message: 'Answer created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(query: IPaginationQuery, question_id?: number) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['title']);

    const filters = pagination.format_filters({
      question_id,
    });

    return pagination.arrange(
      await Answer.findAndCountAll({
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
    const answer = await Answer.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Question,
        },
      ],
    });

    if (!answer) {
      throw new NotFoundException(`Answer not found`);
    }
    return {
      message: 'Answer fetched successfully',
      data: answer,
    };
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto) {
    try {
      const { title, attachment, question_id } = updateAnswerDto;

      const answer = await Answer.findByPk(id);

      if (!answer) {
        throw new NotFoundException(`Answer not found`);
      }

      await answer.update({
        title,
        attachment,
        question_id,
      });

      return {
        message: 'Answer updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const answer = await Answer.findByPk(id, {
      paranoid: false,
    });

    if (!answer) {
      throw new NotFoundException(`Answer not found`);
    }

    if (permanent) {
      await answer.destroy({ force: true });
      return {
        message: 'Answer deleted permanently',
      };
    } else if (restore) {
      if (answer.deleted_at === null) {
        throw new BadRequestException(`Answer not deleted`);
      }
      answer.restore();
      return {
        message: 'Answer restored successfully',
      };
    }

    await answer.destroy();

    return {
      message: 'Answer deleted successfully',
    };
  }
}
