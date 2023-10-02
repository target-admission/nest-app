import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import Coupon from './entities/coupon.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';

@Injectable()
export class CouponsService {
  async create(createCouponDto: CreateCouponDto) {
    const { title, description, amount, max_usage, type } = createCouponDto;

    await Coupon.create({
      title,
      description,
      amount,
      max_usage,
      type,
    });
    return {
      statusCode: 201,
      message: `${title} registered as a coupon successfully`,
    };
  }
  async findAll(query: IPaginationQuery, type?: string) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const filters = pagination.format_filters({
      type,
    });
    return pagination.arrange(
      await Coupon.findAndCountAll({
        where: {
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
    const coupon = await Coupon.findByPk(id, {
      paranoid: false,
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon not found`);
    }
    return {
      message: 'Coupon fetched successfully',
      data: coupon,
    };
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const { title, description, amount, max_usage, type } = updateCouponDto;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      throw new NotFoundException(`Coupon not found`);
    }
    await coupon.update({
      title,
      description,
      amount,
      max_usage,
      type,
    });
    return {
      message: 'Coupon Updated Successfully',
    };
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const coupon = await Coupon.findByPk(id, {
      paranoid: false,
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon not found`);
    }

    if (permanent) {
      await coupon.destroy({ force: true });
      return {
        message: 'Coupon deleted permanently',
      };
    } else if (restore) {
      if (coupon.deleted_at === null) {
        throw new BadRequestException(`Coupon not deleted`);
      }
      coupon.restore();
      return {
        message: 'Coupon restored successfully',
      };
    }

    await coupon.destroy();

    return {
      message: 'coupon deleted successfully',
    };
  }
}
