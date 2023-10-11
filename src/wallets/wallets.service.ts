import { Injectable, NotFoundException } from '@nestjs/common';
import Wallet from './entities/wallet.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import User from 'src/users/entities/user.entity';

@Injectable()
export class WalletsService {
  async findAll(query: IPaginationQuery, type?: string, user_id?: number) {
    const pagination = new Pagination(query);

    const filters = pagination.format_filters({
      type,
      user_id,
    });

    // get query props
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    return pagination.arrange(
      await Wallet.findAndCountAll({
        where: {
          ...filters,
          ...trash_query,
        },
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'is_active', 'deleted_at'],
        },
        attributes: {
          exclude: ['user_id'],
        },
        order,
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    const wallet = await Wallet.findByPk(id, {});

    if (!wallet) {
      throw new NotFoundException(`wallet not found`);
    }

    return {
      message: 'Information fetched successfully',
      data: wallet,
    };
  }
}
