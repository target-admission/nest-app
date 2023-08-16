import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Pagination from 'src/utils/Pagination';
import Session from './entities/user-session.entity';
import User from 'src/users/entities/user.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';

@Injectable()
export class SessionsService {
  async findAll(query: IPaginationQuery, user?: number) {
    const pagination = new Pagination(query);

    // get query props
    const { limit, offset, paranoid } = pagination.get_attributes();

    // get search object
    // const search_ops = pagination.get_search_ops([
    //   'address_details',
    //   'device_details',
    // ]);

    // get filter props
    const filters = pagination.format_filters({
      user_id: user,
    });

    return pagination.arrange(
      await Session.findAndCountAll({
        where: {
          // [Op.or]: search_ops,
          ...filters,
        },
        include: {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'first_name',
            'last_name',
            'is_active',
            'deleted_at',
          ],
        },
        attributes: {
          exclude: ['user_id'],
        },
        limit,
        offset,
        paranoid,
      }),
    );
  }

  // Force Signout
  async forceSessionOut(id: number) {
    // find session
    const session = await Session.findByPk(id);

    if (!session) throw new NotFoundException('No session found.');

    // check if already logged out
    if (session?.logged_out_at !== null)
      throw new UnauthorizedException('This session is already signed out.');

    // logout session
    session.logged_out_at = new Date();
    session.save();

    return {
      message: `Session logged out successfully.`,
    };
  }

  // Delete Session
  async remove(id: number) {
    // find session
    const session = await Session.findByPk(id);

    if (!session) throw new NotFoundException('No session available.');

    // check if already logged out
    if (session?.logged_out_at === null) {
      // logout session
      session.logged_out_at = new Date();
      session.save();
    }

    session.destroy();

    return {
      message: `Session deleted successfully.`,
    };
  }
}
