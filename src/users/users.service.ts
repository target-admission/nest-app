import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import User from './entities/user.entity';

@Injectable()
export class UsersService {
  async findAll(query: IPaginationQuery) {
    const pagination = new Pagination(query);

    // get query props
    const { limit, offset, paranoid } = pagination.get_attributes();

    // get search object
    const search_ops = pagination.get_search_ops([
      'first_name',
      'last_name',
      'username',
      'phone',
    ]);

    // // get filter props
    // const filters = pagination.format_filters({
    //   role_id: role,
    // });

    return pagination.arrange(
      await User.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          // ...filters,
        },
        attributes: {
          exclude: ['password'],
        },
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return {
      message: 'Information fetched successfully',
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { first_name, last_name, username, gender, email, dob, address } =
      updateUserDto;

    const user = await User.findByPk(id, {});

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await user.update({
      first_name,
      last_name,
      username,
      gender,
      email,
      dob,
      address,
    });

    return {
      message: 'Information updated successfully',
    };
  }

  public async activeInactive(id: number) {
    {
      const user = await User.findByPk(id, {});

      if (!user) {
        throw new NotFoundException('No user found!');
      }

      await user.update({
        is_active: !user.is_active,
      });
      await user.save();

      return {
        message: `User ${
          !user.is_active ? 'suspended' : 'activated'
        } successfully`,
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
