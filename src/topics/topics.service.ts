import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import Topic from './entities/topic.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';

@Injectable()
export class TopicsService {
  async create(createTopicDto: CreateTopicDto) {
    const { name, description, chapter_id } = createTopicDto;

    await Topic.create({
      name,
      description,
      chapter_id,
    });
    return {
      statusCode: 201,
      message: `${name} registered as a topic successfully`,
    };
  }

  async findAll(query: IPaginationQuery, chapter_id?: number) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);
    const filters = pagination.format_filters({
      chapter_id,
    });
    return pagination.arrange(
      await Topic.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,
        },
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    const topic = await Topic.findByPk(id, {
      paranoid: false,
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found`);
    }
    return {
      message: 'Topic fetched successfully',
      data: topic,
    };
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    const { name, description, chapter_id } = updateTopicDto;

    const topic = await Topic.findByPk(id);
    if (!topic) {
      throw new NotFoundException(`Topic not found`);
    }
    await topic.update({
      name,
      description,
      chapter_id,
    });
    return {
      message: 'Topic updated successfully',
    };
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const topic = await Topic.findByPk(id, {
      paranoid: false,
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found`);
    }

    if (permanent) {
      await topic.destroy({ force: true });
      return {
        message: 'Topic deleted permanently',
      };
    } else if (restore) {
      if (topic.deleted_at === null) {
        throw new BadRequestException(`Topic not deleted`);
      }
      topic.restore();
      return {
        message: 'Topic restored successfully',
      };
    }

    await topic.destroy();

    return {
      message: 'Topic deleted successfully',
    };
  }
}
