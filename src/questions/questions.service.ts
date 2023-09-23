import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import Question from './entities/question.entity';
import Exam from 'src/exams/entities/exam.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import QuestionBank from 'src/question-bank/entities/question-bank.entity';
import Answer from 'src/answers/entities/answer.entity';

@Injectable()
export class QuestionsService {
  async create(createQuestionDto: CreateQuestionDto) {
    try {
      const {
        question,
        explaination,
        solution_id,
        type,
        category_id,
        topic_id,
        exam_id,
      } = createQuestionDto;

      if (exam_id) {
        const exam = await Exam.findByPk(exam_id);
        // Create Question
        const que = await Question.create({
          question,
          explaination,
          solution_id,
          type,
          category_id,
          topic_id,
        });

        if (exam_id) await exam.$add('questions', que);

        return {
          success: true,
          data: {
            ...que.dataValues,
          },
          message: 'Question created successfully',
        };
      } else {
        // Create Question
        const que = await Question.create({
          question,
          explaination,
          solution_id,
          type,
          category_id,
          topic_id,
        });

        return {
          success: true,
          data: {
            ...que.dataValues,
          },
          message: 'Question created successfully',
        };
      }
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(
    query?: IPaginationQuery,
    type?: string,
    category_id?: number,
    topic_id?: number,
    exam_id?: number,
  ) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops([
      'question',
      'explaination',
      'type',
    ]);

    const filters = pagination.format_filters({
      type,
      category_id,
      topic_id,
    });

    return pagination.arrange(
      await Question.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,
        },
        include: [
          {
            model: Answer,
            as: 'answers',
          },
          {
            model: Exam,
            as: 'linked_exams',
            where: {
              ...(exam_id && {
                id: exam_id,
              }),
            },
            include: [
              {
                model: QuestionBank,
                as: 'question_bank',
              },
            ],
            through: { attributes: [] },
          },
        ],
        order,
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    const question = await Question.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Answer,
          as: 'answers',
        },
        {
          model: Exam,
          as: 'linked_exams',
          include: [
            {
              model: QuestionBank,
              as: 'question_bank',
            },
          ],
          through: { attributes: [] },
        },
      ],
    });

    if (!question) {
      throw new NotFoundException(`Question not found`);
    }
    return {
      message: 'Question fetched successfully',
      data: question,
    };
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    try {
      const {
        question,
        explaination,
        solution_id,
        type,
        category_id,
        topic_id,
      } = updateQuestionDto;

      const que = await Question.findByPk(id);

      if (!que) {
        throw new NotFoundException(`Question not found`);
      }

      await que.update({
        question,
        explaination,
        solution_id,
        type,
        category_id,
        topic_id,
      });
      return {
        message: 'Question updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const question = await Question.findByPk(id, {
      paranoid: false,
    });

    if (!question) {
      throw new NotFoundException(`Question not found`);
    }

    if (permanent) {
      await question.destroy({ force: true });
      return {
        message: 'Question deleted permanently',
      };
    } else if (restore) {
      if (question.deleted_at === null) {
        throw new BadRequestException(`Question not deleted`);
      }
      question.restore();
      return {
        message: 'Question restored successfully',
      };
    }

    await question.destroy();

    return {
      message: 'Question deleted successfully',
    };
  }
}
