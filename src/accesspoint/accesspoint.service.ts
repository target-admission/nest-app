import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccesspointDto } from './dto/create-accesspoint.dto';
import { UpdateAccesspointDto } from './dto/update-accesspoint.dto';
import AccessPoint from './entities/accesspoint.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';

@Injectable()
export class AccesspointService {
  async create(createAccesspointDto: CreateAccesspointDto) {
    try {
      await AccessPoint.create(
        {
          ...createAccesspointDto,
        },
        {
          fields: ['point_name'],
        },
      );

      return {
        success: true,
        message: `New access point ${createAccesspointDto.point_name} created successfully`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(query: IPaginationQuery) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid } = pagination.get_attributes();
    const search_ops = pagination.get_search_ops(['point_name']);
    return pagination.arrange(
      await AccessPoint.findAndCountAll({
        where: {
          [Op.or]: search_ops,
        },

        limit,
        offset,
        paranoid,
      }),
    );
  }

  public async findOne(id: number) {
    const point = await AccessPoint.findByPk(id, {});
    if (!point) {
      throw new NotFoundException('No point name found!');
    }
    return {
      success: true,
      message: 'Information fetched successfully',
      data: point,
    };
  }

  async update(id: number, updateAccesspointDto: UpdateAccesspointDto) {
    const { point_name } = updateAccesspointDto;
    const point = await AccessPoint.findByPk(id, {});
    if (!point) {
      throw new NotFoundException(`No point found!`);
    }
    await point.update({
      point_name,
    });
    return 'Information updated successfully';
  }

  async remove(id: number) {
    return `This action removes a #${id} accesspoint`;
  }
}
