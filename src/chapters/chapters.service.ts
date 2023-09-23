import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import Chapter from './entities/chapter.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

@Injectable()
export class ChaptersService {
  async create(createChapterDto: CreateChapterDto) {
    const { name, description, subject_id } = createChapterDto;

    await Chapter.create({
      name,
      description,
      subject_id,
    });
    return {
      statusCode: 201,
      message: `${name} registered as a chapter successfully`,
    };
  }

  async findAll(query: IPaginationQuery, subject_id?: number) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);
    const filters = pagination.format_filters({
      subject_id,
    });
    return pagination.arrange(
      await Chapter.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,
        },
        include: [
          {
            association: 'subject',
          },
        ],
        attributes: {
          include: [
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM topic WHERE topic.chapter_id = Chapter.id)`,
              ),
              'total_topics',
            ],
          ],
        },
        order,
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    const chapter = await Chapter.findByPk(id, {
      include: [
        {
          association: 'subject',
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM topic WHERE topic.chapter_id = Chapter.id)`,
            ),
            'total_topics',
          ],
        ],
      },
      paranoid: false,
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter not found`);
    }
    return {
      message: 'Chapter fetched successfully',
      data: chapter,
    };
  }

  async update(id: number, updateChapterDto: UpdateChapterDto) {
    const { name, description, subject_id } = updateChapterDto;

    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
      throw new NotFoundException(`Chapter not found`);
    }
    await chapter.update({
      name,
      description,
      subject_id,
    });
    return {
      message: 'Chapter updated successfully',
    };
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const chapter = await Chapter.findByPk(id, {
      paranoid: false,
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter not found`);
    }

    if (permanent) {
      await chapter.destroy({ force: true });
      return {
        message: 'Chapter deleted permanently',
      };
    } else if (restore) {
      if (chapter.deleted_at === null) {
        throw new BadRequestException(`Chapter not deleted`);
      }
      chapter.restore();
      return {
        message: 'Chapter restored successfully',
      };
    }

    await chapter.destroy();

    return {
      message: 'chapter deleted successfully',
    };
  }
}
